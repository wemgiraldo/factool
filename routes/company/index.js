var express = require('express');
var router = express.Router();
var companyController = require("../../controllers/companyController");


/* LIST COMPANY */
router.get('/company/list', companyController.companyList);

/* SHOW COMPANY */
router.get('/company/show/:id', companyController.showCompany);

/* EDIT COMPANY */
router.get('/company/edit/:companyId?', companyController.edit_get);
router.post('/company/edit/:companyId?', companyController.edit_post);


module.exports = router;