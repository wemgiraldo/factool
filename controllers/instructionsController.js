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

var log = { creation: [], acceptance: [], rejection: [], setAsPaid: [], setAsInvoiced: [] };


/* 
*
* INSTRUCTIONs CONTROLLERS
* 
*/

/* LIST OF INSTRUCTIONS CREDITOR OR DEBTOR */
exports.listInstructionsD = [
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
        req.filter['debtor'] = req.id;
        req.filter['created_ts'] = {
            $between: [req.dateFrom, req.dateTo]
        }

        next();
    },
    getInstructionsList,
    getPaymentMatricesList,
    getDteList,
    getTypes,
    getPlants,
    function (req, res) {

        var data = { data: [] };

        for (var i = 0; i < req.instructions.length; i++) {
            var ingr = req.instructions[i];
            var dte = getDteById(req.dtes, ingr.id_cen);
            var payM = getPayMxById(req.payment_matrix, ingr.payment_matrix);
            data.data.push([
                "",
                ingr.id_cen,
                payM.billingWindow.billingType.title,
                ingr.creditor_info.name,
                ingr.debtor_info.name,
                ingr.amount,
                ingr.amount_gross,
                getBillingStById(req.billing_status_type, ingr.status_billed),
                getPaymentStById(req.payment_status_type, ingr.status_paid),
                ingr.status_billed_2,
                (dte !== undefined) ? dte.folio : "",
                (dte !== undefined) ? getDteTypeById(req.dte_type, dte.type) : "",
                (dte !== undefined) ? dte.emission_file : "",
                (dte !== undefined) ? dte.acceptance_dt : "",
                (dte !== undefined) ? getDteAcceptStById(req.dte_acceptance_status, parseInt(dte.acceptance_status)) : ""

            ]);
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

        return res.render("instructions/list_instructionsD", { type: req.type, months: req.months, plants: req.plants });

    }]

exports.listInstructionsC = [
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
    getPaymentMatricesList,
    getDteList,
    getTypes,
    getPlants,
    function (req, res) {

        var data = { data: [] };

        for (var i = 0; i < req.instructions.length; i++) {
            var ingr = req.instructions[i];
            var dte = getDteById(req.dtes, ingr.id_cen);
            var payM = getPayMxById(req.payment_matrix, ingr.payment_matrix);
            data.data.push([
                "",
                ingr.id_cen,
                payM.billingWindow.billingType.title,
                ingr.creditor_info.name,
                ingr.debtor_info.name,
                ingr.amount,
                ingr.amount_gross,
                getBillingStById(req.billing_status_type, ingr.status_billed),
                getPaymentStById(req.payment_status_type, ingr.status_paid),
                //ingr.status_billed_2,
                ingr.status_paid_2,
                ingr.paid_ts,
                (dte !== undefined) ? dte.folio : "",
                (dte !== undefined) ? getDteTypeById(req.dte_type, dte.type) : "",
                (dte !== undefined) ? dte.emission_file : "",
                (dte !== undefined) ? dte.acceptance_dt : "",
                (dte !== undefined) ? getDteAcceptStById(req.dte_acceptance_status, parseInt(dte.acceptance_status)) : ""

            ]);
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

        return res.render("instructions/list_instructionsC", { type: req.type, months: req.months, plants: req.plants });

    }]

/* SET AS PAID */
exports.setAsPaid = [
    function (req, res, next) {

        if (req.body.list === "") {
            return res.send("No invoices selected!");
        }
        logger.log("START SETASPAID INVOICES: " + req.body.list);
        log["setAsPaid"].push("START SETASPAID INVOICES: " + req.body.list);

        var status_paid = req.body.status_paid;
        var lists = req.body.list.split(",");

        async.forEachOf(lists, function (value, key, callback) {
            models.instructions.findOne({ where: { id_cen: value }, include: [{ model: models.company, as: "debtor_info" }, { model: models.company, as: "creditor_info" }] }).then(instr => {
                instr.updateAttributes({ status_paid_2: status_paid, paid_ts: new Date() });
                logger.log("SETASPAID INVOICES DONE: " + value);
                log["setAsPaid"].push("SETASPAID INVOICES DONE: " + value);
                callback();
            });
        }, function (err) {
            if (err) logger.log(err);
            next();
        });
    },
    function (req, res) {
        return res.send({ res: "OK" });
    }
]

/* SET AS INVOICED */
exports.setAsInvoiced = [
    function (req, res, next) {

        if (req.body.list === "") {
            return res.send("No invoices selected!");
        }
        logger.log("START SETASINVOICED INVOICES: " + req.body.list);
        log["setAsInvoiced"].push("START SETASINVOICED INVOICES: " + req.body.list);

        var status_billed = req.body.status_billed;
        var lists = req.body.list.split(",");

        async.forEachOf(lists, function (value, key, callback) {
            models.instructions.findOne({ where: { id_cen: value }, include: [{ model: models.company, as: "debtor_info" }, { model: models.company, as: "creditor_info" }] }).then(instr => {
                instr.updateAttributes({ status_billed_2: status_billed });
                logger.log("SETASINVOICED INVOICES DONE: " + value);
                log["setAsInvoiced"].push("SETASINVOICED INVOICES DONE: " + value);
                callback();
            });
        }, function (err) {
            if (err) logger.log(err);
            next();
        });
    },
    function (req, res) {
        return res.send({ res: "OK" });
    }
]

/* CREATE INVOICEs */
exports.createInvoice = [
    function (req, res, next) {

        if (req.body.list === "") {
            return res.send("No invoices selected!");
        }
        logger.log("START CREATION INVOICES: " + req.body.list);
        log["creation"].push("START CREATION INVOICES: " + req.body.list);

        var lists = req.body.list.split(",");

        asyncLoop(lists.length, function (loop) {
            id = lists[loop.iteration()];

            models.instructions.findAll({ where: { id_cen: id }, limit: 1, include: [{ model: models.company, as: "debtor_info" }, { model: models.company, as: "creditor_info" }] }).then(instr => {
                req.instruction = instr[0];
                models.payment_matrices.findAll({ where: { id_cen: req.instruction.payment_matrix }, limit: 1, include: [{ model: models.billing_windows, as: "billingWindow", include: [{ model: models.billing_type, as: "billingType" }] }] }).then(function (payment_matrix) {
                    req.payment_matrix = payment_matrix[0];
                    facturacion_cl.createInvoice33XML(req.instruction, req.payment_matrix, function (err, result) {
                        if (err) {
                            log["creation"].push(err);
                            return loop.error(err);
                        }
                        logger.log("Invoice n°: " + req.instruction.id_cen + " created! sent to CEN! saved!");
                        log["creation"].push("Invoice n°: " + req.instruction.id_cen + " created! sent to CEN! saved!");
                        return loop.next();
                    });
                });
            });
        },
            function (err) {
                if (err) {
                    logger.log(err);
                    log["creation"].push(err);
                    return res.send({ res: "ERR", msg: err });
                }
                next();
            });
    },
    function (req, res) {
        cen.refreshData("DteC", function () {
            cen.refreshData("InstructionsC", function () {
                req.flash("success", "Invoices created!");
                log["creation"].push("Invoices created!");
                return res.send({ res: "OK" });
            });
        });
    }
]

/* ACCEPT INVOICEs */
exports.acceptInvoice = [
    function (req, res, next) {

        if (req.body.list === "") {
            return res.send("No invoices selected!");
        }
        var lists = req.body.list.split(",");

        logger.log("START ACCEPT INVOICES: " + req.body.list);
        log["acceptance"].push("START ACCEPT INVOICES: " + req.body.list);

        asyncLoop(lists.length, function (loop) {
            id = lists[loop.iteration()];

            models.dte.findAll({ where: { instruction: id }, limit: 1 }).then(dte => {
                if (dte.length === 0) return loop.error("no DTE associated to the Instruction:" + id);
                req.dte = dte[0];
                cen.postAcceptedDte(req.dte, function (err, result) {
                    if (err) return loop.error(err);
                    logger.log("Invoice n°: " + req.dte.folio + " accepted into CEN!");
                    log["acceptance"].push("Invoice n°: " + req.dte.folio + " accepted into CEN!");

                    return loop.next();
                });
            });
        }, function (err) {
            if (err) {
                logger.log(err);
                return res.send(err);
            }
            next();
        });
    },
    function (req, res) {
        cen.refreshData("DteD", function () {
            cen.refreshData("InstructionsD", function () {
                req.flash("success", "Invoices accepted!");
                return res.send({ res: "OK" });
            });
        });
    }
]

/* REJECT INVOICEs */
exports.rejectInvoice = [
    function (req, res, next) {

        if (req.body.list === "") {
            return res.send("No invoices selected!");
        }
        var lists = req.body.list.split(",");

        logger.log("START REJECT INVOICES: " + req.body.list);
        log["rejection"].push("START REJECT INVOICES: " + req.body.list);

        asyncLoop(lists.length, function (loop) {
            id = lists[loop.iteration()];

            models.dte.findAll({ where: { instruction: id }, limit: 1 }).then(dte => {
                if (dte.length === 0) return loop.error("no DTE associated to the Instruction:" + id);
                req.dte = dte[0];
                cen.postRejectedDte(req.dte, function (err, result) {
                    if (err) return loop.error(err);
                    logger.log("Invoice n°: " + req.dte.folio + " rejected into CEN!");
                    log["rejection"].push("Invoice n°: " + req.dte.folio + " rejected into CEN!");
                    return loop.next();
                });
            })
        }, function (err) {
            if (err) {
                logger.log(err);
                return res.send(err);
            }
            next();
        });
    },
    function (req, res) {
        cen.refreshData("DteD", function () {
            cen.refreshData("InstructionsD", function () {
                req.flash("success", "Invoices rejected!");
                return res.send({ res: "OK" });
            });
        });
    }
]

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

function getPlants(req, res, next) {

    models.plants.findAll().then(plants => {
        req.plants = plants;
        return next();
    });

}

function getDteTypeById(dteType, id) {

    for (var i = 0; i < dteType.length; i++) {
        var dteT = dteType[i];
        if (dteT.id === id) return dteT.sii_code;
    }

}

function getDteAcceptStById(dteAcceptSt, id) {

    for (var i = 0; i < dteAcceptSt.length; i++) {
        var dteAS = dteAcceptSt[i];
        if (dteAS.id === id) return dteAS.name;
    }

}

function getPayMxById(payment_matrix, id) {

    for (var i = 0; i < payment_matrix.length; i++) {
        var payM = payment_matrix[i];
        if (payM.id_cen === id) return payM;
    }

}

function getBillingStById(billingSt, id) {

    for (var i = 0; i < billingSt.length; i++) {
        var bSt = billingSt[i];
        if (bSt.id === id) return bSt.name;
    }

}

function getPaymentStById(paymentSt, id) {

    for (var i = 0; i < paymentSt.length; i++) {
        var pSt = paymentSt[i];
        if (pSt.id === id) return pSt.name;
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

function getPaymentMatricesList(req, res, next) {

    models.payment_matrices.findAll({ include: [{ model: models.billing_windows, as: "billingWindow", include: [{ model: models.billing_type, as: "billingType" }] }] }).then(function (payment_matrix) {
        req.payment_matrix = payment_matrix;
        return next();
    })
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