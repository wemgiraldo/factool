const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

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
        req.dateTo = new Date(req.year, req.month , 0);

        req.filter = {};
        req.filter[req.type] = req.id;
        req.filter['created_ts>'] = req.dateFrom;
        req.filter['updated_ts<'] = req.dateTo;

        next();
    },
    getInstructionsList,
    getCompanyList,
    function (req, res) {

        var data = { data: [] };

        for (var i = 0; i < req.data.length; i++) {
            var ingr = req.data[i];
            data.data.push([
                ingr.id,
                //ingr.payment_matrix,
                getNameById(req.companies, ingr.creditor),
                getNameById(req.companies, ingr.debtor),
                ingr.amount,
                ingr.amount_gross,
                //ingr.closed,
                ingr.status,
                ingr.status_billed,
                ingr.status_paid,
                //ingr.resolution,
                //ingr.max_payment_date,
                //ingr.informed_paid_amount,
                ingr.is_paid,
                //ingr.aux_data_payment_matrix_natural_key,
                //ingr.aux_data_payment_matrix_concept,
                //ingr.created_ts,
                //ingr.updated_ts
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

        return res.render("instructions/list", { type: req.type, months: req.months  });

    }]



function getInstructionsList(req, res, next) {

    factoolDb.findInstructions(
        {
            where: req.filter,
            select: ["*"],
            order: {
                id: "ASC"
            }
        }, function (err, rows, fields) {

            if (err) {
                return next(err);
            }

            req.data = rows;

            return next();

        });
}

function getNameById(companies, id) {
    for (var i = 0; i < companies.length; i++) {
        var company = companies[i];
        if (id === company.id_cen) return company.name;
    }
}

function getCompanyList(req, res, next) {

    factoolDb.findCompany(function (err, rows, fields) {

        if (err) {
            return next(err);
        }

        req.companies = rows;

        return next();

    });
}