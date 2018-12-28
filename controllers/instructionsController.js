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

var log = { creation: [], setAsPaid: [], setAsInvoiced: [] };


/* 
*
* INSTRUCTIONs CONTROLLERS
* 
*/

/* LIST OF INSTRUCTIONS DEBTOR */
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

            /* if (!dte) {
                 console.log("ERR")
             }
 
             if (!payM) {
                 console.log("ERR")
             }*/

            data.data.push([
                "",
                ingr.id_cen,
                payM.billingWindow.billingType.title,
                ingr.creditor_info.name,
                ingr.debtor_info.name,
                ingr.amount,
                ingr.amount_gross,
                ingr.status_billed,
                ingr.status_paid,
                ingr.status_billed_2,
                (dte !== undefined) ? dte.folio : "",
                (dte !== undefined) ? getDteTypeById(req.dte_type, dte.type) : "",
                (dte !== undefined) ? dte.emission_file : "",
                (dte !== undefined) ? parseInt(dte.acceptance_status) : "",
                (dte !== undefined) ? dte.acceptance_dt : ""
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

/* LIST OF INSTRUCTIONS CREDITOR  */
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

            /*if (!dte) {
                console.log("ERR")
            }

            if (!payM) {
                console.log("ERR")
            }*/

            data.data.push([
                "",
                ingr.id_cen,
                payM.billingWindow.billingType.title,
                ingr.creditor_info.name,
                ingr.debtor_info.name,
                ingr.amount,
                ingr.amount_gross,
                ingr.status_billed,
                ingr.status_paid,
                ingr.status_paid_2,
                (dte !== undefined) ? dte.folio : "",
                (dte !== undefined) ? getDteTypeById(req.dte_type, dte.type) : "",
                (dte !== undefined) ? dte.emission_file : "",
                (dte !== undefined) ? parseInt(dte.acceptance_status) : "",
                (dte !== undefined) ? dte.acceptance_dt : "",
                ingr.paid_ts
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

exports.checkPaid = [
    function (req, res, next) {

        req.fileName = req.query.fileName;

        if (!req.fileName) {
            return res.render("instructions/check_paid", { file: null });
        }

        next();
    },
    function (req, res, next) {

        req.pathXls = path.join(global.appRoot, '/public/upload_files/', req.fileName);
        var wb = XLSX.readFile(req.pathXls);
        var ws = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });

        var cols = {
            "0": "",
            "1": "Date",
            "2": "Description",
            "3": "Doc Number",
            "4": "Out",
            "5": "In",
            "6": "Total"
        };

        var data = { data: [] };
        for (var i = 14; i < ws.length; i++) {
            var row = ws[i];
            if (row.length === 0) break;
            data.data.push([
                "",
                moment(new Date((row[0] - (25567 + 1)) * 86400 * 1000)).format("YYYY-MM-DD"), // date
                row[1], // description
                row[2], // doc number
                row[3], // out
                row[4], // in
                row[5]  // total
            ]);
        }

        return res.render("instructions/check_paid", { data: data.data, cols: cols });

    }
]


/* SET AS PAID */
exports.setAsPaid = [
    function (req, res, next) {
        log["setAsPaid"] = [];
        next();
    },
    function (req, res, next) {

        if (req.body.list === "") {
            log["setAsPaid"].push("No invoices selected!");
            return res.send({ err: { msg: "No invoices selected!" } });
        }
        logger.log("START SETASPAID INVOICES: " + req.body.list);
        log["setAsPaid"].push("START SETASPAID INVOICES: " + req.body.list);

        var pay = req.body.pay.split(",");
        var payDate = req.body.payDate.split(",");
        var lists = req.body.list.split(",");

        async.forEachOf(lists, function (value, key, callback) {
            models.instructions.findOne({ where: { id_cen: value }, include: [{ model: models.company, as: "debtor_info" }, { model: models.company, as: "creditor_info" }] }).then(instr => {
                instr.updateAttributes({ status_paid_2: pay[key], paid_ts: payDate[key] });
                logger.log("SETASPAID INVOICES DONE: " + value);
                log["setAsPaid"].push("SETASPAID INVOICES DONE: " + value);
                return callback();
            });
        }, function (err) {
            if (err) logger.log(err);
            next();
        });
    },
    function (req, res) {
        cen.refreshData({ filter: "InstructionsC", id: parseInt(req.body.idCompany) }, function (err) {
            if (err) {
                logger.log(err);
                log["setAsPaid"].push("Invoices set as paid with some errors!");
                return res.send({ err: { msg: err } });
            }
            log["setAsPaid"].push("Invoices set as paid!");
            return res.send({ res: "OK" });
        });
    }
]


/* DELETE INVOICES */
exports.deleteInvoices = [
    function (req, res, next) {

        if (req.body.list === "") {
            return res.send({ err: { msg: "No invoices selected!" } });
        }
        logger.log("START DELETE INVOICES: " + req.body.list);

        var lists = req.body.list.split(",");

        async.forEachOf(lists, function (value, key, callback) {
            models.dte.destroy({ where: { instruction: value } }).then(instr => {
                return callback();
            });
        }, function (err) {
            if (err) logger.log(err);
            next();
        });
    },
    function (req, res) {
        logger.log("START DELETE INVOICES: " + req.body.list + " COMPLETED");
        return res.send({ res: "OK" });
    }
]


/* SET AS INVOICED */
exports.setAsInvoiced = [
    function (req, res, next) {
        log["setAsInvoiced"] = [];
        next();
    },
    function (req, res, next) {

        if (req.body.list === "") {
            log["setAsInvoiced"].push("No invoices selected!");
            return res.send({ err: { msg: "No invoices selected!" } });
        }
        logger.log("START SETASINVOICED INVOICES: " + req.body.list);
        log["setAsInvoiced"].push("START SETASINVOICED INVOICES: " + req.body.list);

        var folio = req.body.folio.split(",");
        var type = req.body.type.split(",");
        var status_billed = req.body.invoiced_st.split(",");
        var lists = req.body.list.split(",");
        var accept_st = req.body.accept_st.split(",");
        var accept_date = req.body.accept_date.split(",");

        async.forEachOf(lists, function (value, key, callback) {
            models.instructions.findOne({ where: { id_cen: value }, include: [{ model: models.company, as: "debtor_info" }, { model: models.company, as: "creditor_info" }] }).then(instr => {
                instr.updateAttributes({ status_billed_2: status_billed[key] });

                var data = {
                    instruction: value,
                    gross_amount: instr.amount_gross,
                    net_amount: instr.amount,
                    folio: folio[key],
                    type: type[key],
                    acceptance_dt: accept_date[key],
                    reported_by_creditor: false,
                    acceptance_status: accept_st[key]
                }

                cen.postCreateDte(data, function (err, result) {
                    if (err) return callback(err, false);
                    logger.log("SETASINVOICED INVOICES DONE: " + value);
                    log["setAsInvoiced"].push("SETASINVOICED INVOICES DONE: " + value);
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
                log["setAsInvoiced"].push("Invoices set as invoiced with some errors!");
                return res.send({ err: { msg: err } });
            }
            cen.refreshData({ filter: "InstructionsD", id: parseInt(req.body.idCompany) }, function (err) {
                if (err) {
                    logger.log(err);
                    log["setAsInvoiced"].push("Invoices set as invoiced with some errors!");
                    return res.send({ err: { msg: err } });
                }
                log["setAsInvoiced"].push("Invoices set as invoiced!");
                return res.send({ res: "OK" });
            });
        });
    }
]

/* CREATE INVOICEs */
exports.createInvoice = [
    function (req, res, next) {
        log["creation"] = [];
        next();
    },
    getDteList,
    function (req, res, next) {

        if (req.body.list === "") {
            log["creation"].push("No invoices selected!");
            return res.send({ err: { msg: "No invoices selected!" } });
        }
        logger.log("START CREATION INVOICES: " + req.body.list);
        log["creation"].push("START CREATION INVOICES: " + req.body.list);

        var lists = req.body.list.split(",");

        req.instruction = [];
        req.payment_matrix = [];

        async.forEachOfLimit(lists, 1, function (value, key, callback) {
            id = value;
            models.instructions.findAll({ where: { id_cen: id }, limit: 1, include: [{ model: models.company, as: "debtor_info" }, { model: models.company, as: "creditor_info" }] }).then(instr => {
                req.instruction = instr[0];
                var dte = getDteById(req.dtes, req.instruction.id_cen);
                if (dte) {
                    logger.log("Invoice for instruction n°: " + req.instruction.id_cen + " already exist!");
                    log["creation"].push("Invoice for instruction n°: " + req.instruction.id_cen + " already exist!");
                    return callback();
                }
                models.payment_matrices.findAll({ where: { id_cen: req.instruction.payment_matrix }, limit: 1, include: [{ model: models.billing_windows, as: "billingWindow", include: [{ model: models.billing_type, as: "billingType" }] }] }).then(function (payment_matrix) {
                    req.payment_matrix = payment_matrix[0];
                    facturacion_cl.createInvoice33XML(req.instruction, req.payment_matrix, function (err, result) {
                        if (err) {
                            log["creation"].push(err);
                            return callback(err);
                        }
                        logger.log("Invoice for instruction n°: " + req.instruction.id_cen + " created! sent to CEN! saved!");
                        log["creation"].push("Invoice for instruction n°: " + req.instruction.id_cen + " created! sent to CEN! saved!");
                        return callback();
                    });
                });
            });
        }, function (err) {
            if (err) {
                logger.log(err);
                log["creation"].push(err);
                return res.send({ err: { msg: err } });
            }
            next();
        });
    },
    function (req, res) {
        cen.refreshData({ filter: "DteC", id: parseInt(req.body.idCompany) }, function (err) {
            if (err) {
                logger.log(err);
                log["creation"].push("Invoices created with some errors!");
                return res.send({ err: { msg: err } });
            }
            cen.refreshData({ filter: "InstructionsC", id: parseInt(req.body.idCompany) }, function (err) {
                if (err) {
                    logger.log(err);
                    log["creation"].push("Invoices created with some errors!");
                    return res.send({ err: { msg: err } });
                }
                log["creation"].push("Invoices created!");
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

function getPayMxById(payment_matrix, id) {

    for (var i = 0; i < payment_matrix.length; i++) {
        var payM = payment_matrix[i];
        if (payM.id_cen === id) return payM;
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
