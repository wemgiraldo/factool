const passport = require('passport');
const LocalStrategy = require('passport-local');

//init passport, the authetication module
passport.use(new LocalStrategy(
    function(username, password, done) {
  
      factoolDb.findOneUser({ username: username }, function(err, user) {
        if (err) { return done(err); }
  
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
  
        factoolDb.isUserPasswordValid(user,password,function(res) {
          if (!res){
            return done(null, false, { message: 'Incorrect password.' });
          }
  
          return done(null, user);
        });
  
      });
  
    }
  ));
  
  passport.serializeUser(function(user, done) {

    factoolDb.saveUserLogin(user, function(err){
      done(err, user.id);
    });

  });
  
  passport.deserializeUser(function(id, done) {
    factoolDb.findOneUser({id: id}, function (err, user) {
      done(err, user);
    });
  });