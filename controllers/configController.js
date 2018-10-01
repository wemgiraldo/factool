const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


/* 
*
* CONFIG CONTROLLERS
* 
*/

/* LIST USERS */
exports.listUser = [
    findUser,
    function (req, res) {
        return res.render("config/listUser", { users: req.profiles })
    }];

/* DELETE USER */
exports.deleteUser = [
    findUser,
    function (req, res) {
        mercatusDb.deleteUser(req.profile, function(err){
            if (err){
                req.flash("error","Error deleting user");
            }else{
                req.flash("success","User deleted succesfully!");
            }
            return res.redirect("/config/user");
        })
        
    }];

/* EDiT OR CREATE USER */
exports.editUser_get = [
    function (req, res, next) {

        var userId = req.params.userId;

        if (!userId) {
            return res.render("config/editUser", { title: "Create New User", user: null })
        }

        next();
    },
    findUser,

    function (req, res) {
        return res.render("config/editUser", { title: "Edit User "+req.profile.username, user: req.profile })
    }];
 
exports.newUser_post = [
    
    // Validate fields
    body('name', 'Name is required').isLength({ min: 1 }).trim(),
    body('email').isLength({ min: 1 }).withMessage('Email is required').isEmail().withMessage("Must be a valid email")
        .custom((value, { req }) => {
            return new Promise(function(resolve, reject) {
                mercatusDb.findOneUser({email: value},function(err,user){
                    if (!err && user) {
                        return reject('E-mail already in use');
                    }
                    return resolve(true);
                });
            })}).trim(),
    body('password').isLength({ min:8 }).withMessage('Password must be at least 8 characters in length.')
        .matches('[0-9]').withMessage('Password must contain at least 1 number.')
        .matches('[a-z]').withMessage('Password must contain at least 1 lowercase letter.')
        .matches('[A-Z]').withMessage('Password must contain at least 1 uppercase letter.'),
    body('password2','Passwords do not match').custom((value, {req, loc, path}) => {
        if (value !== req.body.password) {
            return false;
        } else {
            return value;
        }
    }),
    // Sanitize (trim and escape) the name field.
    sanitizeBody('*').trim().escape(),
    // PROCESS USER
    (req,res,next)=>{
        delete req.body.password2;
        req.body.username=req.body.email;
        req.body.enabled=Boolean(req.body.enabled);
        mercatusDb.hashPassword(req.body.password,function(err,hash){

            if (err){
                logger.log(err,"err");
                return res.status(500).send('Error hashing password');
            }

            req.body.password=hash;
            return next();
        });
    },
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        var user=req.body;

        title = "Create New User";

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            var err = {};
            for (var i = 0; i < errors.array().length; i++) {
                err[errors.array()[0].param] = errors.array()[0].msg;
            }
            return res.render('config/editUser', { title: title, user: user, errors: err });
        }
        else {
            // Data from form is valid.
            //SAVE USER
            mercatusDb.saveUser(user, function (err, rows, fields) {

                if (err) {
                    throw err;
                }

                logger.log("Created a new User from web.");
                req.flash("success","User created succesfully!");
                res.redirect("/config/user/edit/" + rows.insertId);
            });

        }
    }
];

exports.editUser_post = [

    findUser,
    // Validate fields
    body('name', 'Name is required').isLength({ min: 1 }).trim(),
    body('email').isLength({ min: 1 }).withMessage('Email is required').isEmail().withMessage("Must be a valid email")
        .custom((value, { req }) => {
            return new Promise(function(resolve, reject) {
                if (req.profile.email===value){
                    return resolve(true);
                }
                mercatusDb.findOneUser({email: value},function(err,user){
                    if (!err && user) {
                        return reject('E-mail already in use');
                    }
                    return resolve(true);
                });
            })}).trim(),
    body('password').optional({ checkFalsy: true }).isLength({ min:8 }).withMessage('Password must be at least 8 characters in length.')
        .matches('[0-9]').optional({ checkFalsy: true }).withMessage('Password must contain at least 1 number.')
        .matches('[a-z]').optional({ checkFalsy: true }).withMessage('Password must contain at least 1 lowercase letter.')
        .matches('[A-Z]').optional({ checkFalsy: true }).withMessage('Password must contain at least 1 uppercase letter.'),
    body('password2','Passwords do not match').optional({ checkFalsy: true }).custom((value, {req, loc, path}) => {
        if (value !== req.body.password) {
            return false;
        } else {
            return value;
        }
    }),
    // Sanitize (trim and escape) the name field.
    sanitizeBody('*').trim().escape(),
    // PROCESS USER
    (req,res,next)=>{

        delete req.body.password2;
        req.body.username=req.body.email;
        req.body.enabled=Boolean(req.body.enabled);
        if (req.body.password && req.body.password.length>0){
            mercatusDb.hashPassword(req.body.password,function(err,hash){

                if (err){
                    logger.log(err,"err");
                    return res.status(500).send('Error hashing password');
                }
    
                req.body.password=hash;
                return next();
            });
        }else{
            delete req.body.password;
            return next();
        }

    },
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create or update a genre object with escaped and trimmed data.
        var user=req.profile;
        title = "Edit " + user.name;
        
        user = Object.assign(user, req.body);

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            var err = {};
            for (var i = 0; i < errors.array().length; i++) {
                err[errors.array()[0].param] = errors.array()[0].msg;
            }
            return res.render('config/editUser', { title: title, user: user, errors: err });
        }
        else {
            // Data from form is valid.
            //SAVE USER
            mercatusDb.saveUser(user, function (err, rows, fields) {

                if (err) {
                    throw err;
                }

                logger.log("Created a new User from web.");
                req.flash("success","User updated succesfully!");

                res.redirect("/config/user/edit/" + user.id);
            });

        }
    }
];

/* SETTINGS */

exports.settings_get = function (req, res, next) {

    res.render("config/settings",{config: config});

};

exports.settings_post = [

    // Validate fields
    body('general|name', 'Name is required').isLength({ min: 1 }).trim(),
    body('general|port', 'Port must be greater than 1024 and lower than 65535').isInt({ gt: 1024, lt: 65535 }),
    // Sanitize (trim and escape) the name field.
    sanitizeBody('*').trim(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        for(formField in req.body){

            var tmp=formField.split("|");
            var section=tmp[0];
            var field=tmp[1];

            config[section][field]=req.body[formField];

        }

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            var err = {};
            for (var i = 0; i < errors.array().length; i++) {
                err[errors.array()[0].param] = errors.array()[0].msg;
            }
            return res.render("config/settings",{config: config,  errors: err });
        }
        else {
            // Data from form is valid.
            //MAKE A COPY OF THE OLD CONFIG FILE
            fs.copy(configPath,configPath+".old",{overwrite: true},err => {

                if (err){
                    logger.log(err.message,"err");
                    req.flash("error","Error updating configuration!");
                }else{
                    //SAVE CONFIG FILE
                    fs.writeFile(configPath, JSON.stringify(config), function(err) {
                        if(err) {
                            req.flash("error","Error updating configuration!");
                            logger.log(err,"err");
                        }else{
                            logger.log("Config.json modified from web by "+req.user.name);
                            req.flash("success","Configuration updated succesfully. Reloading servers..");
                        }
                    }); 
                }

                res.redirect("/config/settings");
              
              });


        }
    }
];


function findUser(req, res, next) {

    var options = {};
    if (req.params.userId) {
        options = { where: { id: req.params.userId } };
    }

    mercatusDb.findUser(options, function (err, rows, fields) {

        if (err) {
            return next(err);
        }

        if (rows.length === 0) {
            return res.status(404).send('Not found');
        }

        if (req.params.userId) {
            req.profile = rows[0];
        } else {
            req.profiles = rows;
        }

        return next();

    });
}