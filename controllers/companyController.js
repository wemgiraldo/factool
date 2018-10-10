const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var models = require('../models');

/* 
*
* COMPANIES CONTROLLERS
* 
*/

/* LIST OF COMPANIES */
exports.companyList = [
    getCompanyList,
    function (req, res) {

        var data = { data: [] };
        for (var i = 0; i < req.companies.length; i++) {
            var company = req.companies[i];
            data.data.push([
                company.id,
                company.name,
                company.rut,
                company.verification_code,
                company.business_name,
                company.commercial_business,
                //company.dte_reception_email,
                //company.bank_account,
                //company.bank,
                company.commercial_address,
                //company.postal_address,
                //company.manager,
                //company.p_c_first_name,
                //company.p_c_last_name,
                //company.p_c_address,
                //company.p_c_phones,
                //company.p_c_email,
                //company.b_c_first_name,
                //company.b_c_last_name,
                //company.b_c_address,
                //company.b_c_phones,
                //company.b_c_email,
                moment(company.created_ts).format("Y-MM-DD HH:mm:ss"),
                moment(company.updated_ts).format("Y-MM-DD HH:mm:ss")
            ]);
        }

        if (req.xhr) {
            return res.send(data);
        }

        return res.render("company/list");

    }]


function getCompanyList(req, res, next) {

    models.company.findAll().then(companies => {
        req.companies = companies;
        return next();
    })

}
