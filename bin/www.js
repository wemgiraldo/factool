#!/usr/bin/env node

/**
 * Module dependencies.
 */

app = require('../app');
debug = require('debug')('factools:server');
http = require('http');
mysql = require('mysql');
moment = require('moment');
fs = require("fs.extra");  // Oggetto per la lettura filesystem
HigJS = require("../nodeLib/hig.js").HigJS;      // Higeco's Base Functions
factoolDb = require('.//factoolDb');
XLSX = require('xlsx');
CEN_API = require('../nodeLib/cen.js');
FacturacionCL_API = require('../nodeLib/facturacion-cl.js');
models = require('../models');

httpServer = null;
config = null;
cen = null;

configPath = "./config/config.json";

/**
 *  Configuration
**/

config = HigJS.str.toObj(fs.readFileSync(configPath));       // Lettura configurazione server

if (!checkConfig()) {
  process.exit(1);
}

logger = new HigJS.Logger(config.debug.LOG);

fs.watchFile(configPath, function () {

  logger.log("Reloading config...", "inf");

  config = HigJS.str.toObj(fs.readFileSync(configPath)) || {};

  if (!checkConfig()) {
    process.exit(1);
  }

  initDbConnection();
  initServer();

});

initDbConnection();
initServer();

function initServer() {

  /**
  * Configure APP parameters and application wide locals used in pug
  */

  var port = config.general.port;

  app.set('port', port);
  app.locals.idCompany = 339;
  app.locals.moment = require('moment');

  /**
   * Create HTTP server.
   */

  if (httpServer !== null) {
    httpServer.close();
    httpServer = null;
  }
  httpServer = http.createServer(app);
  httpServer.listen(port);
  httpServer.on('error', onError);
  httpServer.on('listening', function () {
    logger.log(`HTTP server listening on port ` + port);
  });

}


function initDbConnection() {

  /*factoolDb.connect(config.mysql, function (err) {

    if (err) {
      logger.log("Error connection to db. Aborting..", "err");
      process.exit(-1);
    } else {
      logger.log("Succesfully connected to db " + config.mysql.database + " on " + config.mysql.dbUser + "@" + config.mysql.dbHost, "inf");
    }

  });*/

  models.sequelize.sync().then(function () {
    /**
     * Listen on provided port, on all network interfaces.
     */
    initAPI();
  });

}


function initAPI() {

  cen = new CEN_API(config);
  facturacion_cl = new FacturacionCL_API(config);

}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + config.general.port
    : 'Port ' + config.general.port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.log(bind + ' requires elevated privileges', "err");
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.log(bind + ' is already in use', "err");
      process.exit(1);
      break;
    default:
      throw error;
  }
}


function checkConfig() {

  if (!config || !config.general.port) {
    console.log("FATAL ERROR, Config file is not valid, error loading server configuration!");
    return false;
  } else {

    // LOG defaults
    if (!config.debug.LOG) {
      console.log("###  MISSING LOG config, using default one.", "war");
      config.debug.LOG = { level: "dbg", file: false, stdout: true, color: true, maxLogLength: 1000 };
    }

    return true;
  }
}
