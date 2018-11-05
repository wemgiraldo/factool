var express = require('express');
var router = express.Router();
var dashboardsController = require("../../controllers/dashboardsController");

/* GET MAIN DASHBOARD */
router.get('/dashboards/', dashboardsController.mainDashboard);

/* getDataEnergy */
router.get('/dashboards/getDataEnergy', dashboardsController.getDataEnergy);

/* getDataMoney */
router.get('/dashboards/getDataMoney', dashboardsController.getDataMoney);

module.exports = router;