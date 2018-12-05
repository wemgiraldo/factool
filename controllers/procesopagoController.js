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

var log = { creation: [], closing: [] };

/* 
*
* PROCESO DE PAGOs CONTROLLERS
* 
*/

/* LIST OF PROCESO DE PAGO */
exports.listProcesoPago = [
    function (req, res, next) {

        req.filterProc = {};
        if (!req.query.id) {
            req.filterProc["idCompany"] = req.params.id;
        } else {
            req.filterProc["idCompany"] = req.query.id;
        }

        next();
    },
    getProcesosList,
    getPlants,
    function (req, res, next) {
        var data = { data: [] };

        for (var i = 0; i < req.proceso.length; i++) {
            var proc = req.proceso[i];

            data.data.push([
                proc.id,
                proc.idCompany,
                proc.bank_account,
                proc.notes,
                proc.created_at,
                proc.closed_at
            ]);
        }

        if (req.xhr) {
            return res.send(data);
        }

        return res.render("instructions/list_procesopagos", { plants: req.plants });
    }]

/* CREATE PROCESO DE PAGO */
exports.createProcesoPago = [
    function (req, res, next) {

        var data = {
            bank_account: req.body.bank_account,
            notes: req.body.notes,
            idCompany: req.body.idCompany,
            created_at: new Date()
        }

        models.proceso_pagos.create(data).then(proceso => {
            next();
        });
    },
    function (req, res) {
        return res.send("Proceso de Pago created!");
    }
]

/* CREATE NOMINA PAGO */
exports.createNominaPago = [
    getDteList,
    function (req, res, next) {

        req.id = req.body.id;
        req.list = req.body.list;

        var data = {
            dtes: req.list
        }

        models.proceso_pagos.findOrCreate({ where: { id: req.id } })
            .spread((record, created) => {
                // IF ALREADY EXISTS, I UPDATE THE DATA
                // ELSE I CREATE THE RECORD AND ADD THE NEW DATA

                if (req.body.list === "") {
                    if (record.dtes === "") {
                        data.dtes = "";
                    } else {
                        data.dtes = record.dtes;
                    }
                }


                logger.log("START CREATION NOMINA DE PAGO: " + req.body.id + " INSTRUCTIONES: " + data.dtes);
                log["creation"].push("START CREATION NOMINA DE PAGO: " + req.body.id + " INSTRUCTIONES: " + data.dtes);


                if (!created) {
                    record.updateAttributes(data);
                } else {
                    record.updateAttributes(data);
                }
                req.proceso = record;
                next();
            })
            .catch(function (error) {
                console.log(error);
                return res.send(error);
            });
    },
    function (req, res, next) {

        req.toXls = [];

        if (req.body.list === "") {
            if (req.proceso.dtes === "") {
                next();
            } else {
                req.body.list = req.proceso.dtes;
            }
        }
        var lists = req.body.list.split(",");

        async.forEachOf(lists, function (value, key, callback) {
            models.instructions.findAll({ where: { id_cen: lists[key] }, limit: 1, include: [{ model: models.company, as: "creditor_info", include: [{ model: models.banks, as: "bank_info" }] }] }).then(instr => {
                if (instr[0].id_cen === undefined) {
                    logger.log("ERROR");
                    return callback();
                }
                var dte = getDteById(req.dtes, instr[0].id_cen);
                if (!dte) return callback();

                req.toXls.push([
                    2,
                    instr[0].creditor_info.rut + instr[0].creditor_info.verification_code,
                    instr[0].creditor_info.business_name,
                    (instr[0].creditor_info.bank_account_2 === null) ? instr[0].creditor_info.bank_account : instr[0].creditor_info.bank_account_2,
                    instr[0].amount_gross,
                    instr[0].creditor_info.bank_info.type,
                    instr[0].creditor_info.bank_info.sbif
                ]);

                req.toXls.push([
                    3,
                    dte.folio,
                    1,
                    moment().format("YYYYMMDD"),
                    instr[0].amount_gross,
                    "",
                    ""
                ]);

                return callback();
            });
        }, function (err) {
            if (err) logger.log(err);
            next();
        });
    },
    function (req, res, next) {
        req.pathXls = path.join(global.appRoot, '/public/nomina_pagos/nominaPagos_' + moment().format('L').replace(new RegExp("/", "g"), '') + '.xls');
        req.pathfile = '/public/nomina_pagos/';
        req.filename = 'nominaPagos_' + moment().format('L').replace(new RegExp("/", "g"), '') + '.xls';
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(req.toXls, { skipHeader: 1 });
        XLSX.utils.book_append_sheet(wb, ws, "No Header");
        XLSX.writeFile(wb, req.pathXls);
        log["creation"].push("FILE EXCEL CREATED!");
        next();
    },
    function (req, res) {
        logger.log("Nomina de pagos created!");
        log["creation"].push("Nomina de pagos created!");
        return res.send({ path: req.pathfile, filename: req.filename });
    }
]

/* CLOSE NOMINA PAGO */
exports.closeNominaPago = [
    function (req, res, next) {
        req.id = req.body.id;
        req.closed_at = req.body.closed_at;
        req.notes = req.body.notes;

        logger.log("START CLOSING NOMINA DE PAGO: " + req.body.id);
        log["closing"].push("START CLOSING NOMINA DE PAGO: " + req.body.id);

        next();
    },
    function (req, res, next) {
        var data = {
            closed_at: moment(req.closed_at).format(),
            notes: req.notes
        }

        models.proceso_pagos.findOrCreate({ where: { id: req.id } })
            .spread((record, created) => {
                // IF ALREADY EXISTS, I UPDATE THE DATA
                // ELSE I CREATE THE RECORD AND ADD THE NEW DATA
                if (!created) {
                    record.updateAttributes(data);
                } else {
                    record.updateAttributes(data);
                }
                req.proceso = record;
                next();
            })
            .catch(function (error) {
                console.log(error);
                return res.send(error);
            });
    },
    function (req, res, next) {

        var lists = req.proceso.dtes.split(",");
        var data = {};

        async.forEachOfLimit(lists, 1, function (value, key, callback) {
            models.instructions.findAll({ where: { id_cen: value }, limit: 1, include: [{ model: models.company, as: "debtor_info" }, { model: models.company, as: "creditor_info" }] }).then(instr => {
                req.instruction = instr[0];

                data = {
                    debtor: req.instruction.debtor,
                    creditor: req.instruction.creditor,
                    amount: req.instruction.amount_gross,
                    payment_dt: moment(req.closed_at).format("Y-M-D"),
                    transaction_type: 3,
                    actual_collector: "test",
                    instruction_amount_tuples: [[req.instruction.id_cen, req.instruction.amount_gross]],
                }

                cen.postCreatePayment(data, function (err, result) {
                    if (err) return callback(err);

                    logger.log("Payment created " + req.instruction.id_cen + " and saved into CEN!");
                    log["closing"].push("Payment created " + req.instruction.id_cen + " and saved into CEN!");

                    return callback();
                });
            });
        }, function (err) {
            if (err) logger.log(err);
            next();
        });
    },
    function (req, res) {
        cen.refreshData({ filter: "DteD", id: parseInt(req.body.idCompany) }, function (err) {
            if (err) {
                logger.log(err);
                log["closing"].push("Nomina de pagos created with some errors!");
                return res.send({ err: { msg: err } });
            }
            cen.refreshData({ filter: "InstructionsD", id: parseInt(req.body.idCompany) }, function (err) {
                if (err) {
                    logger.log(err);
                    log["closing"].push("Nomina de pagos created with some errors!");
                    return res.send({ err: { msg: err } });
                }
                log["closing"].push("Nomina de pagos created");
                return res.send({ res: "Nomina de pagos created" });
            });
        });
    }
]

/* SHOW PROCESO PAGO */
exports.showProcesoPago = [
    function (req, res, next) {

        req.idProc = req.params.id;
        req.idCompany = req.params.idCompany;

        req.filterProc = {};
        req.filterProc["id"] = req.idProc;

        next();
    },
    getProcesosList,
    function (req, res, next) {

        req.filterInstrPay = {};

        if (req.proceso[0].dtes) {

            req.filterInstrPay = {
                $or: []
            }

            var dtes = req.proceso[0].dtes.split(",");
            for (var i = 0; i < dtes.length; i++) {
                dte = dtes[i];
                req.filterInstrPay.$or.push([{
                    "id_cen": dte
                }]);
            }

        } else {

            req.filterInstrPay['debtor'] = req.idCompany;

            req.filterInstrPay['status_paid'] = {
                $eq: 1
            }

            req.filterInstrPay['$or'] =
                [
                    {
                        "status_billed": {
                            $gte: 2
                        }
                    },
                    {
                        "status_billed_2": {
                            $gte: 2
                        },
                    }

                ]
        }
        next();
    },
    getInstructionsList,
    getDteList,
    getTypes,
    function (req, res) {

        var cols = {
            "0": "",
            "1": "id_cen",
            "2": "Creditor",
            "3": "Period",
            "5": "Amount Net",
            "5": "Amount Gross",
            "6": "DTE Number",
            "7": "DTE Type",
            "8": "Debtor",
        };

        var rows = { data: [] };

        for (var i = 0; i < req.instructions.length; i++) {
            var instr = req.instructions[i];
            var dte = getDteById(req.dtes, instr.id_cen);
            rows.data.push([
                "",
                instr.id_cen,
                instr.creditor_info.name,
                moment(instr.created_ts).format("Y-MM"),
                instr.amount,
                instr.amount_gross,
                (dte !== undefined) ? dte.folio : "",
                (dte !== undefined) ? getDteTypeById(req.dte_type, dte.type) : "",
                instr.debtor
            ]);
        }

        return res.render("instructions/show_procesopagos", { proceso: req.proceso[0], data: rows.data, cols: cols });

    }];


/* getBankAccount */
exports.getBankAccount = function (req, res) {

    models.bank_account.findAll({ where: { id_company: req.query.idCompany } }).then(bank_accounts => {
        req.bank_accounts = bank_accounts;
        return res.send(req.bank_accounts);
    });

}

/* UPDATE LOG */
exports.updateLog = function (req, res) {

    if (req.body.log && log[req.body.log]) {
        var msg = log[req.body.log].splice(0, 1);
        return res.send(msg);
    }

    res.status(404).send('Log Not found');
}

function getDteById(dtes, id) {

    for (var i = 0; i < dtes.length; i++) {
        var dte = dtes[i];
        if (dte.instruction === id) return dte;
    }

}

function getDteTypeById(dteType, id) {

    for (var i = 0; i < dteType.length; i++) {
        var dteT = dteType[i];
        if (dteT.id === id) return dteT.sii_code;
    }

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

function getProcesosList(req, res, next) {

    if (req.filterProc) {
        models.proceso_pagos.findAll({ where: req.filterProc }).then(procesos => {
            req.proceso = procesos;
            return next();
        })
    } else {
        models.proceso_pagos.findAll().then(procesos => {
            req.proceso = procesos;
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

function getTypes(req, res, next) {

    async.waterfall([
        function (callback) {
            models.dte_type.findAll().then(dte_type => {
                req.dte_type = dte_type;
                return callback(null, true);
            });
        },
        function (err, callback) {
            models.dte_acceptance_status.findAll().then(dte_acceptance_status => {
                req.dte_acceptance_status = dte_acceptance_status;
                return callback(null, true);
            });
        },
        function (err, callback) {
            models.billing_status_type.findAll().then(billing_status_type => {
                req.billing_status_type = billing_status_type;
                return callback(null, true);
            });
        },
        function (err, callback) {
            models.payment_status_type.findAll().then(payment_status_type => {
                req.payment_status_type = payment_status_type;
                return callback(null, true);
            });
        }
    ], function (error, success) {
        if (error) { logger.log('Something is wrong!'); }
        next();
    });
}

function getPlants(req, res, next) {

    models.plants.findAll().then(plants => {
        req.plants = plants;
        return next();
    });

}
