const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

/* 
*
* EVCS CONTROLLERS
* 
*/

/* STATUS */
exports.activeProjectsList = [
    getActiveProjectList,
    function (req, res) {
        
        var data = { data: [] };
        for (var i = 0; i < req.projects.length; i++) {
            var prj = req.projects[i];
            data.data.push([prj.id, prj.name, moment(req.projects[i].opening_date).format("Y-MM-DD"), prj.status]);
        }

        if (req.xhr) {
            return res.send(data);
        }

        return res.render("projects/list");

    }]

exports.allProjectsList = [
    getAllProjectList,
    function (req, res) {

        var data = { data: [] };
        for (var i = 0; i < req.projects.length; i++) {
            var prj = req.projects[i];
            data.data.push([prj.id, prj.name, moment(req.projects[i].opening_date).format("Y-MM-DD"), moment(req.projects[i].closing_date).format("Y-MM-DD"), prj.status]);
        }

        if (req.xhr) {
            return res.send(data);
        }

        return res.render("projects/listall");

    }]

exports.getDevStatus = [
    getAllProjectList,
    function (req, res) {

        var status = {
            openprj: 0,
            inprogr: 0,
            closedprj: 0
        };

        for (var i = 0; i < req.projects.length; i++) {
            var prj = req.projects[i];
            switch (prj.status) {
                case "open":
                    status.openprj++;
                    break;
                case "in progress":
                    status.inprogr++;
                    break;
                case "closed":
                    status.closedprj++;
                    break;
            }
        }

        return res.render("projects/_devStatus", { status: status });

    }]

exports.send = [
    getProject

];

exports.show = [
    getProject,
    function (req, res) {
        req.project.opening_date = moment(req.project.opening_date).format("Y-MM-DD");
        req.project.closing_date = moment(req.project.closing_date).format("Y-MM-DD");
        return res.render("projects/show", { prj: req.project });
    }];

exports.showExecSumm = [

];


/* EDIT OR CREATE PROJECT */
exports.edit_get = [
    function (req, res, next) {

        var id = req.params.id;

        if (!id) {
            return res.render("projects/edit", { title: "Create New Project", prj: null })
        }

        next();
    },
    getProject,
    function (req, res) {
        req.project.opening_date = moment(req.project.opening_date).format("Y-MM-DD");
        req.project.closing_date = moment(req.project.closing_date).format("Y-MM-DD");
        return res.render("projects/edit", { title: "Edit " + req.project.name, prj: req.project })
    }];

exports.edit_post = [

    // Validate fields
    /*
    body('chargeBoxSerialNumber', 'EVC SN required').isLength({ min: 1 }).trim(),
    body('label', 'Label name required').isLength({ min: 1 }).trim(),
    body('latitude', "LATITUDE must be a number between -90 and 90").optional({ checkFalsy: true }).isFloat({ gt: -90, lt: 90 }),
    body('longitude', "LONGITUDE must be a number between -180 and 180").optional({ checkFalsy: true }).isFloat({ gt: -90, lt: 90 }),
   
    // Sanitize (trim and escape) the name field.
    sanitizeBody('*').trim().escape(),
     */

    // GET PROJECT IF EXISTS
    getProject,
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create or update a genre object with escaped and trimmed data.
        var prj;
        if (req.project === null) {
            prj = {};
            title = "Create New Project";
        } else {
            prj = req.project;
            title = "Edit " + prj.name;
        }

        prj = Object.assign(prj, req.body);

        prj.opening_date = moment(prj.opening_date).format("Y-MM-DD");
        prj.closing_date = moment(prj.closing_date).format("Y-MM-DD");

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            var err = {};
            for (var i = 0; i < errors.array().length; i++) {
                err[errors.array()[0].param] = errors.array()[0].msg;
            }
            return res.render('projects/edit', { title: title, prj: prj, errors: err });
        }
        else {
            // Data from form is valid.
            //SAVE (CREATE OR UPDATE) PROJECT
            mercatusDb.saveProject(prj, function (err, rows, fields) {

                if (err) {
                    throw err;
                }

                if (req.project === null) {
                    logger.log("Created a new PROJECT from web. Name: " + prj.name);
                } else {
                    logger.log("Edit a PROJECT from web. Name: " + prj.name);
                }

                //this.CalculateExecSumm();
                res.redirect("/projects/one/" + prj.id);
            });

        }
    }
];

function getActiveProjectList(req, res, next) {

    mercatusDb.findActiveProject(function (err, rows, fields) {

        if (err) {
            return next(err);
        }

        if (rows.length === 0) {
            return res.status(404).send('Not found');
        }

        req.projects = rows;

        return next();

    });
}

function getAllProjectList(req, res, next) {

    var options = {
        select: ["*"]
    };

    mercatusDb.findProject(options, function (err, rows, fields) {

        if (err) {
            return next(err);
        }

        if (rows.length === 0) {
            return res.status(404).send('Not found');
        }

        req.projects = rows;

        return next();

    });
}


function getProject(req, res, next) {

    var options = {};

    if (!req.params.id && !req.body.id) {
        req.project = null;
        return next();
    }

    if (req.params.id) {
        if (req.params.id === "id") {
            options = { where: { id: req.body.id } };
        } else {
            options = { where: { id: req.params.id } };
        }
    }

    mercatusDb.findProject(options, function (err, rows, fields) {

        if (err) {
            return next(err);
        }

        if (rows.length === 0) {
            return res.status(404).send('Not found');
        }

        req.project = rows[0];

        return next();

    });
}

function getProjectId(req, res, next) {

    var options = {};
    if (req.params.id) {
        if (req.params.id === "id") {
            options = { where: { id: req.body.id } };
        } else {
            options = { where: { id: req.params.id } };
        }
    }

    mercatusDb.findProject(options, function (err, rows, fields) {

        if (err) {
            return next(err);
        }

        if (rows.length === 0) {
            return res.status(404).send('Not found');
        }

        req.project = rows[0];

        return next();

    });
}

function calcExecSumm(req, res) {


}