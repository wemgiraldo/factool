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
* PROCESO DE PAGOs CONTROLLERS
* 
*/

/* LIST OF PROCESOS DE PAGO */
exports.listProcesoPago = [
    getProcesosList,
    function (req, res) {

        var data = { data: [] };

        for (var i = 0; i < req.procesos.length; i++) {
            var proc = req.procesos[i];

            data.data.push([
                proc.id,
                proc.bank_account,
                proc.notes,
                proc.created_at,
                proc.closed_at
            ]);
        }

        if (req.xhr) {
            return res.send(data);
        }

        return res.render("instructions/list_procesopagos", {});

    }]

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
                if (!created) {
                    record.updateAttributes(data);
                } else {
                    record.updateAttributes(data);
                }
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
            next();
        }
        var lists = req.body.list.split(",");

        async.forEachOf(lists, function (value, key, callback) {
            models.instructions.findAll({ where: { id_cen: lists[key] }, limit: 1, include: [{ model: models.company, as: "creditor_info", include: [{ model: models.banks, as: "bank_info" }] }] }).then(instr => {
                var dte = getDteById(req.dtes, instr[0].id_cen);
                if (!dte) return callback();

                req.toXls.push([
                    2,
                    instr[0].creditor_info.rut + instr[0].creditor_info.verification_code,
                    instr[0].creditor_info.business_name,
                    instr[0].creditor_info.bank_account,
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
        req.pathXls = './public/nomina_pagos/nominaPagos_' + moment().format('L').replace(new RegExp("/", "g"), '') + '.xls';
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(req.toXls, { skipHeader: 1 });
        XLSX.utils.book_append_sheet(wb, ws, "No Header");
        XLSX.writeFile(wb, req.pathXls);
        next();
    },
    function (req, res) {
        return res.send("Nomina de pagos created!");
    }
]

/* CREATE NOMINA PAGO */
exports.createProcesoPago = [
    function (req, res, next) {

        req.bank_account = req.body.bank_account;
        req.notes = req.body.notes;

        var data = {
            bank_account: req.body.bank_account,
            notes: req.body.notes,
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

/* CLOSE NOMINA PAGO */
exports.closeNominaPago = [
    function (req, res, next) {
        req.id = req.body.id;
        req.closed_at = req.body.closed_at;
        req.notes = req.body.notes;
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



        asyncLoop(lists.length, function (loop) {
            id = lists[loop.iteration()];


            models.instructions.findAll({ where: { id_cen: id }, limit: 1, include: [{ model: models.company, as: "debtor_info" }, { model: models.company, as: "creditor_info" }] }).then(instr => {
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
                    if (err) return loop.error(err);
                    logger.log("Payment created and saved into CEN!");
                    return loop.next();
                });
            });
        });
    },
    function (req, res, next) {

    },
    function (req, res) {
        return res.send("Nomina de pagos created!");
    }
]

/* SHOW PROCESO PAGO */
exports.showProcesoPago = [
    function (req, res, next) {
        req.filterProc = {};
        req.filterProc["id"] = req.params.id;
        next();
    },
    getProcesosList,
    function (req, res, next) {

        req.filterInstrPay = {};

        if (req.proceso.dtes) {

            req.filterInstrPay = {
                $or: []
            }

            var dtes = req.proceso.dtes.split(",");
            for (var i = 0; i < dtes.length; i++) {
                dte = dtes[i];
                req.filterInstrPay.$or.push([{
                    "id_cen": dte
                }]);
            }

        } else {

            req.filterInstrPay['debtor'] = req.params.idCompany;
            req.filterInstrPay['status_billed'] = {
                $gte: 2
            }
            req.filterInstrPay['status_paid'] = {
                $eq: 1
            }
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
            "3": "Amount Net",
            "4": "Amount Gross",
            "5": "DTE Number",
            "6": "DTE Type"
        };

        var rows = { data: [] };

        for (var i = 0; i < req.instructions.length; i++) {
            var instr = req.instructions[i];
            var dte = getDteById(req.dtes, instr.id_cen);
            rows.data.push([
                "",
                instr.id_cen,
                instr.creditor_info.name,
                instr.amount,
                instr.amount_gross,
                (dte !== undefined) ? dte.folio : "",
                (dte !== undefined) ? getDteTypeById(req.dte_type, dte.type) : "",
            ]);
        }

        return res.render("instructions/show_procesopagos", { proceso: req.proceso, data: rows.data, cols: cols });

    }];


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
            req.proceso = procesos[0];
            return next();
        })
    } else {
        models.proceso_pagos.findAll().then(procesos => {
            req.procesos = procesos;
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

function asyncLoop(iterations, func, callback) {
    var index = 0;
    var done = false;
    var loop = {
        next: function () {
            if (done) {
                return;
            }

            if (index < iterations) {
                index++;
                func(loop);

            } else {
                done = true;
                callback();
            }
        },

        error: function (err) {
            done = true;
            callback(err);
        },

        iteration: function () {
            return index - 1;
        },

        break: function () {
            done = true;
            callback();
        }
    };
    loop.next();
    return loop;
}