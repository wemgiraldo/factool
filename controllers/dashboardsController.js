const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const Sequelize = require('sequelize');
const op = Sequelize.Op;

const operatorsAliases = {
    $eq: op.eq,
    $or: op.or,
    $between: op.between,
    $gte: op.gte

    /*
    [Op.and]: {a: 5}           // AND (a = 5)
    [Op.or]: [{a: 5}, {a: 6}]  // (a = 5 OR a = 6)
    [Op.gt]: 6,                // > 6
    [Op.gte]: 6,               // >= 6
    [Op.lt]: 10,               // < 10
    [Op.lte]: 10,              // <= 10
    [Op.ne]: 20,               // != 20
    [Op.eq]: 3,                // = 3
    */
}

/* 
*
* DASHBOARDS CONTROLLERS
* 
*/

/* mainDashboard */
exports.mainDashboard = [
    function (req, res, next) {
        var date = new Date();
        req.firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        req.lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

        req.nInvS = 0;
        req.nInvP = 0;
        req.nPayS = 0;
        req.nPayP = 0;

        next();
    },
    function (req, res, next) {
        //venta
        req.filter = {};
        req.filter['created_ts'] = {
            $between: [req.firstDay, req.lastDay]
        }
        req.filter['creditor'] = app.locals.idCompany;
        models.instructions.findAll({ where: req.filter }).then(instr => {
            req.instrVenta = instr;
            next();
        });
    },
    function (req, res, next) {
        //compra
        req.filter = {};
        req.filter['created_ts'] = {
            $between: [req.firstDay, req.lastDay]
        }
        req.filter['debtor'] = app.locals.idCompany;
        models.instructions.findAll({ where: req.filter }).then(instr => {
            req.instrCompra = instr;
            next();
        });
    },
    function (req, res, next) {
        async.forEachOf(req.instrVenta, function (value, key, callback) {
            if (value.status_billed === 1) req.nInvS = req.nInvS + 1;
            if (value.status_billed >= 2 && value.status_paid === 1) req.nPayS = req.nPayS + 1;
            callback();
        }, function (err) {
            next();
        });
    },
    function (req, res, next) {
        async.forEachOf(req.instrCompra, function (value, key, callback) {
            if (value.status_billed === 1) req.nInvP = req.nInvP + 1;
            if (value.status_billed >= 2 && value.status_paid === 1) req.nPayP = req.nPayP + 1;
            callback();
        }, function (err) {
            next();
        });
    },
    function (req, res) {
        return res.render("dashboards/dashboard", { statistics: { salesPI: req.nInvS, purchasesPI: req.nInvP, salesPP: req.nPayS, purchasesPP: req.nPayP } });
    }]

/* getDataMoney */
exports.getDataMoney = [
    function (req, res, next) {
        req.year = req.query.year;
        req.firstDay = new Date(req.year, 01, 01);
        req.lastDay = new Date(req.year, 12, 31);

        req.venta = new Array(13).fill(0);
        req.venta.splice(0, 1);
        req.compra = new Array(13).fill(0);
        req.compra.splice(0, 1);

        next();
    },
    function (req, res, next) {
        //compra
        req.filter = {};
        req.filter['created_ts'] = {
            $between: [req.firstDay, req.lastDay]
        }
        req.filter['debtor'] = app.locals.idCompany;

        models.instructions.findAll({
            attributes: [
                [models.sequelize.fn('month', models.sequelize.col('created_ts')), "month"],
                [models.sequelize.fn('year', models.sequelize.col('created_ts')), "year"],
                [models.sequelize.fn('sum', models.sequelize.col('amount')), "amount"]
            ],
            where: req.filter,
            group: [
                [models.sequelize.fn('month', models.sequelize.col('created_ts'))],
                [models.sequelize.fn('year', models.sequelize.col('created_ts'))]
            ],
            order: [['created_ts', 'ASC']]
        }).then(instr => {
            async.forEachOf(instr, function (value, key, callback) {
                req.venta[value.dataValues.month] = parseFloat(value.dataValues.amount);
                callback();
            }, function (err) {
                next();
            });
        });
    },
    function (req, res, next) {
        //venta
        req.filter = {};
        req.filter['created_ts'] = {
            $between: [req.firstDay, req.lastDay]
        }
        req.filter['creditor'] = app.locals.idCompany;

        models.instructions.findAll({
            attributes: [
                [models.sequelize.fn('month', models.sequelize.col('created_ts')), "month"],
                [models.sequelize.fn('year', models.sequelize.col('created_ts')), "year"],
                [models.sequelize.fn('sum', models.sequelize.col('amount')), "amount"]
            ],
            where: req.filter,
            group: [
                [models.sequelize.fn('month', models.sequelize.col('created_ts'))],
                [models.sequelize.fn('year', models.sequelize.col('created_ts'))]
            ],
            order: [['created_ts', 'ASC']]
        }).then(instr => {
            async.forEachOf(instr, function (value, key, callback) {
                req.compra[value.dataValues.month] = parseFloat(value.dataValues.amount);
                callback();
            }, function (err) {
                next();
            });
        });

    },
    function (req, res, next) {
        res.send({ compra: req.compra, venta: req.venta });
    }]



/* getDataEnergy */
exports.getDataEnergy = [
    function (req, res, next) {

        req.from = new Date(req.query.from);
        req.to = new Date(req.query.to);

        req.filter = {};
        req.filter['timestamp'] = {
            $between: [req.from, req.to]
        }

        next();
    },
    function (req, res, next) {
        models.plants.findAll().then(plants => {
            req.plants = plants;
            next();
        });
    },
    function (req, res, next) {
        var timeDiff = Math.abs(req.to.getTime() - req.from.getTime());
        req.nSamples = Math.ceil(timeDiff / (3600 * 1000));
        req.series = [];

        async.forEachOf(req.plants, function (value, key, callback) {
            req.series.push({ name: value.name, item_id: value.item_id, data: new Array(req.nSamples).fill(null) });
            callback();
        }, function (err) {
            next();
        });
    },
    function (req, res, next) {

        async.forEachOf(req.series, function (value, key, callback) {
            var serie = value;
            req.filter['item_id'] = value.item_id;

            models.measurements.findAll({
                attributes: [
                    'plant_id',
                    'item_id',
                    'timestamp',
                    [models.sequelize.fn('max', models.sequelize.col('value')), "max"],
                    [models.sequelize.fn('min', models.sequelize.col('value')), "min"]
                ],
                where: req.filter,
                group: [
                    'item_id',
                    'plant_id',
                    [models.sequelize.fn('hour', models.sequelize.col('timestamp'))],
                    [models.sequelize.fn('day', models.sequelize.col('timestamp'))],
                    [models.sequelize.fn('month', models.sequelize.col('timestamp'))],
                    [models.sequelize.fn('year', models.sequelize.col('timestamp'))]
                ],
                order: [['timestamp', 'ASC']]
            }).then(measurements => {
                async.forEachOf(measurements, function (value, key, callback) {
                    var timeDiff = Math.abs(value.dataValues.timestamp.getTime() - req.from.getTime());
                    var nSample = Math.ceil(timeDiff / (3600 * 1000));
                    serie.data[nSample] = value.dataValues.max - value.dataValues.min;
                    callback();
                }, function (err) {
                    callback();
                });
            });
        }, function (err) {
            next();
        });

    },
    function (req, res, next) {
        res.send(req.series)
    }]

