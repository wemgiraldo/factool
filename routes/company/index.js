var express = require('express');
var router = express.Router();
var companyController = require("../../controllers/companyController");


/* LIST OF INVOICE IN */
router.get('/company/list', companyController.companyList);


module.exports = router;