var async = require('async')

var state = {
  pool: null
}

exports.connect = function(conf,callback) {
    
  state.pool = mysql.createPool({
    host: conf.dbHost,
    user: conf.dbUser,
    password: conf.dbPassword,
    database: conf.database
  });

  return callback();
}

exports.get = function() {
  return state.pool;
}

exports.drop = function(tables, done) {
  var pool = state.pool;
  
  if (!pool) return done(new Error('Missing database connection.'))

  async.each(tables, function(name, cb) {
    pool.query('DELETE * FROM ' + name, cb);
  }, done);
}
