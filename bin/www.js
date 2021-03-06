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
CEN_API = require('../nodeLib/cen.js');
FacturacionCL_API = require('../nodeLib/facturacion-cl.js');
HigecoPortalDriver = require('../nodeLib/higeco.js');
models = require('../models');
async = require("async");
json2xls = require('json2xls');
XLSX = require('xlsx');
path = require('path');
nodemailer = require('nodemailer');


httpServer = null;
config = null;
cen = null;
facturacion_cl = null;
higeco_driver = null;

global.appRoot = path.resolve(__dirname.replace('bin', ''));

configPath = path.join(global.appRoot, '/config/config.json')


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
 
  var port = process.env.PORT || config.general.port;

  app.set('port', port);
  app.locals.moment = require('moment');
  app.locals.idCompany = config.cenAPI.idCompanyDefault;

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

  models.sequelize.sync().then(function () {
    initAPI();
  });

}


function initAPI() {

  cen = new CEN_API(config);
  facturacion_cl = new FacturacionCL_API(config);
  higeco_driver = new HigecoPortalDriver(config);
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
    logger.log("FATAL ERROR, Config file is not valid, error loading server configuration!");
    return false;
  } else {

    // LOG defaults
    if (!config.debug.LOG) {
      logger.log("###  MISSING LOG config, using default one.", "war");
      config.debug.LOG = { level: "dbg", file: false, stdout: true, color: true, maxLogLength: 1000 };
    }

    return true;
  }
}
