const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

/* SETTINGS */

exports.settings_get = function (req, res, next) {
    config_name = req.params.config_name;
    res.render("settingsprj/edit", { config: settingsprj, config_name: config_name });

};

exports.settings_post = [

    // Validate fields
    /*body('general|name', 'Name is required').isLength({ min: 1 }).trim(),
    body('general|port', 'Port must be greater than 1024 and lower than 65535').isInt({ gt: 1024, lt: 65535 }),
    */

    // Sanitize (trim and escape) the name field.
    sanitizeBody('*').trim(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        for (formField in req.body) {

            var tmp = formField.split("|");
            var section = tmp[0];
            var field = tmp[1];

            settingsprj[section][field] = req.body[formField];

        }

        config_name = config_name = req.params.config_name;

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            var err = {};
            for (var i = 0; i < errors.array().length; i++) {
                err[errors.array()[0].param] = errors.array()[0].msg;
            }
            return res.render("settingsprj/edit", { config: settingsprj, config_name: config_name, errors: err });
        }
        else {
            // Data from form is valid.


            //SAVE CONFIG FILE
            fs.writeFile(settingsprjPath, JSON.stringify(settingsprj), function (err) {
                if (err) {
                    req.flash("error", "Error updating configuration!");
                    logger.log(err, "err");
                } else {
                    logger.log("Config.json modified from web by " + req.user.name);
                    req.flash("success", "Configuration updated succesfully. Reloading servers..");
                    
                }
            });

            res.redirect("/");

            
        };


    }
];
