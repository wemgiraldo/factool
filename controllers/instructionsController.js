const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const operatorsAliases = {
    $eq: op.eq,
    $or: op.or,
    $between: op.between
}


var async = require("async");
var models = require('../models');

/* 
*
* INSTRUCTIONs CONTROLLERS
* 
*/

/* LIST OF INSTRUCTIONS CREDITOR OR DEBTOR */
exports.instructionsList = [
    function (req, res, next) {
        req.id = parseInt(req.query.id);
        req.type = req.query.type;

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
        req.filter[req.type] = req.id;
        req.filter['created_ts'] = {
            $between: [req.dateFrom, req.dateTo]
        }

        next();
    },
    getInstructionsList,
    getDteList,
    getTypes,
    function (req, res) {

        var data = { data: [] };

        for (var i = 0; i < req.instructions.length; i++) {
            var ingr = req.instructions[i];
            var dte = getDteById(req.dtes, ingr.id_cen)
            data.data.push([
                "",
                ingr.id_cen,
                //ingr.payment_matrix,
                ingr.creditor_info.name,
                ingr.debtor_info.name,
                ingr.amount,
                ingr.amount_gross,
                //ingr.closed,
                ingr.status,
                getBillingStById(req.billing_status_type, ingr.status_billed),
                getPaymentStById(req.payment_status_type, ingr.status_paid),
                //ingr.resolution,
                //ingr.max_payment_date,
                //ingr.informed_paid_amount,
                //ingr.is_paid,
                //ingr.aux_data_payment_matrix_natural_key,
                //ingr.aux_data_payment_matrix_concept,
                //ingr.created_ts,
                //ingr.updated_ts,
                (dte !== undefined) ? dte.folio : "",
                (dte !== undefined) ? getDteTypeById(req.dte_type, dte.type) : "",
                (dte !== undefined) ? getDteAcceptStById(req.dte_acceptance_status, dte.acceptance_status) : ""

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
        req.months[12] = "November";
        req.months[13] = "December";

        return res.render("instructions/list", { type: req.type, months: req.months });

    }]


/* CREATE INVOICEs */
exports.createInvoice = [
    function (req, res, next) {

        var list = req.body.list.split(",");

        for (var i = 0; i < list.length; i++) {
            var instruction = list[i];
            models.instructions.findAll({ where: { id_cen: instruction }, limit: 1, include: [{ model: models.company, as: "debtor_info" }, { model: models.company, as: "creditor_info" }] }).then(instr => {
                req.instruction = instr[0];
                models.payment_matrices.findAll({ where: { id_cen: instr[0].payment_matrix }, limit: 1, include: [{ model: models.billing_windows, as: "billingWindow", include: [{ model: models.billing_type, as: "billingType" }] }] }).then(function (payment_matrix) {
                    req.payment_matrix = payment_matrix[0];
                    facturacion_cl.createInvoice33XML(req.instruction, req.payment_matrix);
                });
            });
        }
    }
]

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

function getDteAcceptStById(dteAcceptSt, id) {

    for (var i = 0; i < dteAcceptSt.length; i++) {
        var dteAS = dteAcceptSt[i];
        if (dteAS.id === id) return dteAS.name;
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

    models.instructions.findAll({ where: req.filter, include: [{ model: models.company, as: "debtor_info" }, { model: models.company, as: "creditor_info" }] }).then(instructions => {
        req.instructions = instructions;
        return next();
    })

}

function getDteList(req, res, next) {

    models.dte.findAll().then(dtes => {
        req.dtes = dtes;
        return next();
    })

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
        if (error) { alert('Something is wrong!'); }
        next();
    });

}
