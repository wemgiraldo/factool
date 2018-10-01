const passport = require('passport');
const LocalStrategy = require('passport-local');

//init passport, the authetication module
passport.use(new LocalStrategy(
    function(username, password, done) {
  
      mercatusDb.findOneUser({ username: username }, function(err, user) {
        if (err) { return done(err); }
  
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
  
        mercatusDb.isUserPasswordValid(user,password,function(res) {
          if (!res){
            return done(null, false, { message: 'Incorrect password.' });
          }
  
          return done(null, user);
        });
  
      });
  
    }
  ));
  
  passport.serializeUser(function(user, done) {

    mercatusDb.saveUserLogin(user, function(err){
      done(err, user.id);
    });

  });
  
  passport.deserializeUser(function(id, done) {
    mercatusDb.findOneUser({id: id}, function (err, user) {
      done(err, user);
    });
  });