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

/* productionDashboard */
exports.productionDashboard = [
    function (req, res, next) {
        req.year = req.query.year;
        req.idCompany = req.query.id;
        req.firstDay = new Date(req.year, 01, 01);
        req.lastDay = new Date(req.year, 12, 31);

        req.venta = new Array(13).fill(0);
        req.venta.splice(0, 1);
        req.compra = new Array(13).fill(0);
        req.compra.splice(0, 1);

        req.plantsFilterC = {
            $or: []
        }

        req.plantsFilterD = {
            $or: []
        }

        next();
    },
    getPlants,
    function (req, res, next) {
        req.plantsFilterC.$or.push({ "creditor": req.idCompany });
        req.plantsFilterD.$or.push({ "debtor": req.idCompany });
        next();
    },
    function (req, res, next) {
        //compra
        req.filter = {};
        req.filter['created_ts'] = {
            $between: [req.firstDay, req.lastDay]
        }
        req.filter['$or'] = req.plantsFilterD.$or;

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
                req.compra[value.dataValues.month - 1] = parseFloat(value.dataValues.amount);
                return callback();
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

        req.filter['$or'] = req.plantsFilterC.$or;

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
                req.venta[value.dataValues.month - 1] = parseFloat(value.dataValues.amount);
                return callback();
            }, function (err) {
                next();
            });
        });

    },
    getPlants,
    function (req, res) {

        var data = { data: [] };

        req.months = {};
        req.months[1] = "January";
        req.months[2] = "February";
        req.months[3] = "March";
        req.months[4] = "April";
        req.months[5] = "May";
        req.months[6] = "June";
        req.months[7] = "July";
        req.months[8] = "August";
        req.months[9] = "September";
        req.months[10] = "October";
        req.months[11] = "November";
        req.months[12] = "December";

        for (var i = 0; i < req.compra.length; i++) {
            data.data.push([
                req.months[i + 1],
                req.compra[i],
                req.venta[i]
            ]);
        }

        if (req.xhr) {
            return res.send(data);
        }

        return res.render("dashboards/dashboard2", { plants: req.plants });
    }]

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

        req.plantsFilterC = {
            $or: []
        }

        req.plantsFilterD = {
            $or: []
        }

        next();
    },
    getPlants,
    function (req, res, next) {
        async.forEachOf(req.plants, function (value, key, callback) {
            req.plantsFilterC.$or.push({ "creditor": value.company_cen_id });
            req.plantsFilterD.$or.push({ "debtor": value.company_cen_id });
            return callback();
        }, function (err) {
            next();
        });
    },
    function (req, res, next) {
        //venta
        req.filter = {};
        req.filter['created_ts'] = {
            $between: [req.firstDay, req.lastDay]
        }
        req.filter['$or'] = req.plantsFilterC.$or;
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
        req.filter['$or'] = req.plantsFilterD.$or;
        models.instructions.findAll({ where: req.filter }).then(instr => {
            req.instrCompra = instr;
            next();
        });
    },
    function (req, res, next) {
        async.forEachOf(req.instrVenta, function (value, key, callback) {
            if (value.status_billed === 1) req.nInvS = req.nInvS + 1;
            if (value.status_billed >= 2 && value.status_paid === 1) req.nPayS = req.nPayS + 1;
            return callback();
        }, function (err) {
            next();
        });
    },
    function (req, res, next) {
        async.forEachOf(req.instrCompra, function (value, key, callback) {
            if (value.status_billed === 1) req.nInvP = req.nInvP + 1;
            if (value.status_billed >= 2 && value.status_paid === 1) req.nPayP = req.nPayP + 1;
            return callback();
        }, function (err) {
            next();
        });
    },
    getPlants,
    function (req, res) {
        return res.render("dashboards/dashboard1", { plants: req.plants, statistics: { salesPI: req.nInvS, purchasesPI: req.nInvP, salesPP: req.nPayS, purchasesPP: req.nPayP } });
    }]

/* getDataMoney */
exports.getDataMoney = [
    function (req, res, next) {
        req.year = req.query.year;
        req.idCompany = req.query.idCompany;
        req.firstDay = new Date(req.year, 01, 01);
        req.lastDay = new Date(req.year, 12, 31);

        req.venta = new Array(13).fill(0);
        req.venta.splice(0, 1);
        req.compra = new Array(13).fill(0);
        req.compra.splice(0, 1);

        req.plantsFilterC = {
            $or: []
        }

        req.plantsFilterD = {
            $or: []
        }

        next();
    },
    getPlants,
    function (req, res, next) {
        req.series = [];
        async.forEachOf(req.plants, function (value, key, callback) {
            req.series.push({ name: value.name, debtor: value.company_cen_id, creditor: value.company_cen_id, venta: new Array(12).fill(0), compra: new Array(12).fill(0) });
            return callback();
        }, function (err) {
            next();
        });
    },
    function (req, res, next) {

        async.forEachOf(req.series, function (value, key, callback) {
            var serie = value;

            req.filter = {};
            req.filter['created_ts'] = {
                $between: [req.firstDay, req.lastDay]
            }
            req.filter['$or'] = {
                debtor: serie.debtor
            };

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
                order: [
                    [models.sequelize.fn('month', models.sequelize.col('created_ts')), 'ASC'],
                    [models.sequelize.fn('year', models.sequelize.col('created_ts')), 'ASC']
                ]
            }).then(instr => {
                async.forEachOf(instr, function (value, key, callback) {
                    serie.compra[value.dataValues.month - 1] = parseFloat(value.dataValues.amount);
                    return callback();
                }, function (err) {
                    return callback();
                });
            });
        }, function (err) {
            next();
        });
    },
    function (req, res, next) {

        async.forEachOf(req.series, function (value, key, callback) {
            var serie = value;

            req.filter = {};
            req.filter['created_ts'] = {
                $between: [req.firstDay, req.lastDay]
            }
            req.filter['$or'] = {
                creditor: serie.creditor
            };


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
                order: [
                    [models.sequelize.fn('month', models.sequelize.col('created_ts')), 'ASC'],
                    [models.sequelize.fn('year', models.sequelize.col('created_ts')), 'ASC']
                ]
            }).then(instr => {
                async.forEachOf(instr, function (value, key, callback) {
                    serie.venta[value.dataValues.month - 1] = parseFloat(value.dataValues.amount);
                    return callback();
                }, function (err) {
                    return callback();
                });
            });
        }, function (err) {
            next();
        });
    },
    function (req, res, next) {
        res.send(req.series);
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
    getPlants,
    function (req, res, next) {
        var timeDiff = Math.abs(req.to.getTime() - req.from.getTime());
        req.nSamples = Math.ceil(timeDiff / (3600 * 1000));
        req.series = [];

        async.forEachOf(req.plants, function (value, key, callback) {
            req.series.push({ name: value.name, plant_id: value.plant_id, item_id: value.item_id, data: new Array(req.nSamples).fill(null) });
            return callback();
        }, function (err) {
            next();
        });
    },
    function (req, res, next) {

        async.forEachOf(req.series, function (value, key, callback) {
            var serie = value;
            req.filter['item_id'] = value.item_id;
            req.filter['plant_id'] = value.plant_id;

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
                order: [
                    ['item_id', 'ASC'],
                    ['plant_id', 'ASC'],
                    [models.sequelize.fn('hour', models.sequelize.col('timestamp')), 'ASC'],
                    [models.sequelize.fn('day', models.sequelize.col('timestamp')), 'ASC'],
                    [models.sequelize.fn('month', models.sequelize.col('timestamp')), 'ASC'],
                    [models.sequelize.fn('year', models.sequelize.col('timestamp')), 'ASC']
                ]
            }).then(measurements => {
                async.forEachOf(measurements, function (value, key, callback) {
                    var timeDiff = Math.abs(value.dataValues.timestamp.getTime() - req.from.getTime());
                    var nSample = Math.ceil(timeDiff / (3600 * 1000));
                    serie.data[nSample] = value.dataValues.max - value.dataValues.min;
                    return callback();
                }, function (err) {
                    return callback();
                });
            });
        }, function (err) {
            next();
        });

    },
    function (req, res, next) {
        res.send(req.series)
    }]

/* getDataSapPayments */
exports.getDataSapPayments = [
    function (req, res, next) {

        if (!req.query.id) {
            req.id = parseInt(app.locals.idCompany);
        } else {
            req.id = parseInt(req.query.id);
        }

        if (req.query.month === undefined && req.query.year === undefined) {
            var date = new Date();
            req.month = date.getMonth();
            req.year = date.getFullYear();
        } else {
            req.month = parseInt(req.query.month);
            req.year = parseInt(req.query.year);
        }

        req.dateFrom = new Date(req.year, req.month - 1, 1);
        req.dateTo = new Date(req.year, req.month, 0);

        req.filter = {};
        req.filter['creditor'] = req.id;
        req.filter['created_ts'] = {
            $between: [req.dateFrom, req.dateTo]
        }
        next();
    },
    getInstructionsList,
    getDteList,
    getPlants,
    getPlantById,
    function (req, res) {

        var data = { data: [] };

        for (var i = 0; i < req.instructions.length; i++) {
            var ingr = req.instructions[i];
            var dte = getDteById(req.dtes, ingr.id_cen);
            if (dte) {
                data.data.push([
                    "1-1-1-03-09",
                    "",
                    Math.round(ingr.amount * 1.19),
                    req.code_plant.company_cen_name + " FV" + dte.folio,
                    ingr.debtor_info.rut,
                    "AB",
                    dte.folio,
                    dte.emission_dt,
                    dte.emission_dt,
                    "FV",
                    dte.folio,
                    ingr.amount,
                    Math.round(ingr.amount * 1.19) - ingr.amount,
                    Math.round(ingr.amount * 1.19)
                ]);
            }
        }

        if (req.xhr) {
            return res.send(data);
        }

        req.months = {};
        req.months[1] = "January";
        req.months[2] = "February";
        req.months[3] = "March";
        req.months[4] = "April";
        req.months[5] = "May";
        req.months[6] = "June";
        req.months[7] = "July";
        req.months[8] = "August";
        req.months[9] = "September";
        req.months[10] = "October";
        req.months[11] = "November";
        req.months[12] = "December";

        return res.render("dashboards/dashboard4", { months: req.months, plants: req.plants });

    }]

/* getDataSapSales */
exports.getDataSapSales = [
    function (req, res, next) {

        if (!req.query.id) {
            req.id = parseInt(app.locals.idCompany);
        } else {
            req.id = parseInt(req.query.id);
        }

        if (req.query.month === undefined && req.query.year === undefined) {
            var date = new Date();
            req.month = date.getMonth();
            req.year = date.getFullYear();
        } else {
            req.month = parseInt(req.query.month);
            req.year = parseInt(req.query.year);
        }

        req.dateFrom = new Date(req.year, req.month - 1, 1);
        req.dateTo = new Date(req.year, req.month, 0);

        req.filter = {};
        req.filter['creditor'] = req.id;
        req.filter['created_ts'] = {
            $between: [req.dateFrom, req.dateTo]
        }
        next();
    },
    getInstructionsList,
    getDteList,
    getPlants,
    getPlantById,
    function (req, res) {

        var data = { data: [] };

        // BRUTO
        for (var i = 0; i < req.instructions.length; i++) {
            var ingr = req.instructions[i];
            var dte = getDteById(req.dtes, ingr.id_cen);
            if (dte) {
                data.data.push([
                    "1-1-1-03-09",
                    Math.round(ingr.amount * 1.19),
                    "",
                    req.code_plant.company_cen_name + " FV" + dte.folio,
                    ingr.debtor_info.rut,
                    "FV",
                    dte.folio,
                    dte.emission_dt,
                    dte.emission_dt,
                    "FV",
                    dte.folio,
                    ingr.amount,
                    Math.round(ingr.amount * 1.19) - ingr.amount,
                    Math.round(ingr.amount * 1.19)
                ]);
            }
        }

        // IVA 
        for (var i = 0; i < req.instructions.length; i++) {
            var ingr = req.instructions[i];
            var dte = getDteById(req.dtes, ingr.id_cen);
            if (dte) {
                data.data.push([
                    "2-1-1-05-01",
                    "",
                    Math.round(ingr.amount * 1.19) - ingr.amount,
                    req.code_plant.company_cen_name + " FV" + dte.folio,
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    ""
                ]);
            }
        }

        // NETO
        for (var i = 0; i < req.instructions.length; i++) {
            var ingr = req.instructions[i];
            var dte = getDteById(req.dtes, ingr.id_cen);
            if (dte) {
                data.data.push([
                    "4-1-1-01-01",
                    "",
                    ingr.amount,
                    req.code_plant.company_cen_name + " FV" + dte.folio,
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    ""
                ]);
            }
        }

        if (req.xhr) {
            return res.send(data);
        }

        req.months = {};
        req.months[1] = "January";
        req.months[2] = "February";
        req.months[3] = "March";
        req.months[4] = "April";
        req.months[5] = "May";
        req.months[6] = "June";
        req.months[7] = "July";
        req.months[8] = "August";
        req.months[9] = "September";
        req.months[10] = "October";
        req.months[11] = "November";
        req.months[12] = "December";

        return res.render("dashboards/dashboard3", { months: req.months, plants: req.plants });

    }]


function getPlants(req, res, next) {

    models.plants.findAll().then(plants => {
        req.plants = plants;
        return next();
    });

}

function getInstructionsList(req, res, next) {

    if (req.filterInstrPay) {
        models.instructions.findAll({ where: req.filterInstrPay, include: [{ model: models.company, as: "debtor_info" }, { model: models.company, as: "creditor_info" }] }).then(instructions => {
            req.instructions = instructions;
            return next();
        })
    } else {
        models.instructions.findAll({ where: req.filter, include: [{ model: models.company, as: "debtor_info" }, { model: models.company, as: "creditor_info" }] }).then(instructions => {
            req.instructions = instructions;
            return next();
        })
    }


}

function getDteList(req, res, next) {

    models.dte.findAll().then(dtes => {
        req.dtes = dtes;
        return next();
    });

}

function getPlants(req, res, next) {

    models.plants.findAll().then(plants => {
        req.plants = plants;
        return next();
    });

}

function getDteById(dtes, id) {

    for (var i = 0; i < dtes.length; i++) {
        var dte = dtes[i];
        if (dte.instruction === id) return dte;
    }

}

function getPlantById(req, res, next) {

    models.plants.findAll({ where: { company_cen_id: req.id } }).then(plant => {
        req.code_plant = plant[0];
        return next();
    });

}
