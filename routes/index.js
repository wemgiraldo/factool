var express = require('express');
var router = express.Router();
const passport = require('passport');


/*
* AUTHENTICATION
*/

router.get('/login', function(req, res) {
    res.render('login', { user : req.user, flashMsg: req.flash('error') });
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});


/* 
* DEFAULT ROUTE
*/
router.get('/', function(req, res) {
    res.redirect('/dashboards');
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


// Simple route middleware to ensure user is authenticated.
//  Use this route middleware on any resource that needs to be protected.  If
//  the request is authenticated (typically via a persistent login session),
//  the request will proceed.  Otherwise, the user will be redirected to the
//  login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { 

        res.locals.currentUser=req.user;
        return next(); 
    }
    res.redirect('/login');
}


module.exports = router;

