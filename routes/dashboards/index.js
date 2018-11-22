var express = require('express');
var router = express.Router();
var dashboardsController = require("../../controllers/dashboardsController");

/* GET MAIN DASHBOARD */
router.get('/dashboards/1/', dashboardsController.mainDashboard);

/* GET PRODUCTION DASHBOARD */
router.get('/dashboards/2/', dashboardsController.productionDashboard);

/* GET SAP DATA */
router.get('/dashboards/3/', dashboardsController.getDataSAP);

/* getDataEnergy for charts */
router.get('/dashboards/getDataEnergy', dashboardsController.getDataEnergy);

/* getDataMoney for charts */
router.get('/dashboards/getDataMoney', dashboardsController.getDataMoney);

module.exports = router;