const passport = require('passport');
const LocalStrategy = require('passport-local');
const saltRounds = 10;
var models = require('../models');
var bcrypt = require('bcrypt');

//init passport, the authetication module
passport.use(new LocalStrategy(
  function (username, password, done) {

    models.user.findOne({ where: { username: username } }).then(user => {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      bcrypt.compare(password, user.password, function (err, res) {

        if (!res) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);

      });
    });
  }
));

passport.serializeUser(function (user, done) {
  models.user.findOne({ where: { username: user.username } }).then(user => {
    user.updateAttributes({ last_login: moment().format("Y-MM-DD HH:mm:ss") }).then((user) => {
      done(null, user);
    })
  });
});

passport.deserializeUser(function (user, done) {
  models.user.findOne({ where: { username: user.username } }).then(user => {
    done(null, user);
  });
});
