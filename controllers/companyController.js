const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

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
                company.commercial_address,
                moment(company.created_ts).format("Y-MM-DD HH:mm:ss"),
                moment(company.updated_ts).format("Y-MM-DD HH:mm:ss")
            ]);
        }

        if (req.xhr) {
            return res.send(data);
        }

        return res.render("company/list");

    }]



/* EDiT COMPANY */
exports.edit_get = [
    function (req, res, next) {

        var companyId = req.params.companyId;

        if (!companyId) {
            return res.render("company/edit", { title: "Create New EVC", company: null })
        }

        req.filter = {};
        req.filter['id'] = companyId;
        next();
    },
    getCompanyList,
    function (req, res) {
        return res.render("company/edit", { title: "Edit " + req.company.name, company: req.company })
    }];

exports.edit_post = [
    function (req, res, next) {
        var companyId = req.params.companyId;
        req.filter = {};
        req.filter['id'] = companyId;
        next();
    },
    getCompanyList,
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create or update a genre object with escaped and trimmed data.
        var company;
        if (req.company === null) {
            company = {};
            title = "Create New EVC";
        } else {
            company = req.company;
            title = "Edit " + company.name;
        }

        company = Object.assign(company, req.body);

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            var err = {};
            for (var i = 0; i < errors.array().length; i++) {
                err[errors.array()[0].param] = errors.array()[0].msg;
            }
            return res.render('company/edit', { title: title, evc: evc, errors: err });
        }
        else {
            // Data from form is valid.
            models.company.findOrCreate({ where: req.filter })
                .spread((record, created) => {
                    record.updateAttributes(req.body);
                    logger.log("Modified info about company: " + company.name);
                    res.redirect("/company/show/" + company.id);
                })
                .catch(function (error) {
                    console.log(error);
                    throw error;
                });

        }
    }
];


/* LIST OF COMPANIES */
exports.showCompany = [
    function (req, res, next) {
        req.filter = {};
        req.filter['id'] = req.params.id;
        next();
    },
    getCompanyList,
    function (req, res) {
        return res.render("company/show", { company: req.company });

    }]

function getCompanyList(req, res, next) {

    if (req.filter) {
        models.company.findAll({ where: req.filter }).then(companies => {
            req.company = companies[0];
            return next();
        });
    } else {
        models.company.findAll().then(companies => {
            req.companies = companies;
            return next();
        });
    }

}
