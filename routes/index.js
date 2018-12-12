var express = require('express');
var router = express.Router();
const passport = require('passport');
const fileUpload = require('express-fileupload');


/*
* AUTHENTICATION
*/

router.get('/login', function (req, res) {
    res.render('login', { user: req.user, flashMsg: req.flash('error') });
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});


/* 
* DEFAULT ROUTE
*/
router.get('/', function (req, res) {
    res.redirect('/dashboards/1');
});

/*
* DOWNLOAD
*/
router.get('/download', function (req, res) {
    res.download(path.join(global.appRoot, req.query.path), function (err) {
        console.log(err);
    });
});


/* 
* CONFIG
*/
router.all('/config*', ensureAuthenticated, require('./config'));

/* 
* INVOICE IN
*/
router.all('/instructions*', ensureAuthenticated, require('./instructions'));

/* 
* INVOICE OUT
*/
router.all('/company*', ensureAuthenticated, require('./company'));

/* 
* DASHBOARDS
*/
router.all('/dashboards*', ensureAuthenticated, require('./dashboards'));


// default options
router.use(fileUpload());

router.post('/upload', function (req, res) {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(path.join(global.appRoot, '/public/upload_files/', sampleFile.name), function (err) {
        if (err)
            return res.status(500).send(err);

        res.redirect("/instructions/checkPaid/?fileName=" + sampleFile.name);
    });
});


// Simple route middleware to ensure user is authenticated.
//  Use this route middleware on any resource that needs to be protected.  If
//  the request is authenticated (typically via a persistent login session),
//  the request will proceed.  Otherwise, the user will be redirected to the
//  login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {

        res.locals.currentUser = req.user;
        return next();
    }
    res.redirect('/login');
}


module.exports = router;

