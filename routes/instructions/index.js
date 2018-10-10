var express = require('express');
var router = express.Router();
var instructionsController = require("../../controllers/instructionsController");


/* LIST OF INSTRUCTIONS */
router.get('/instructions/list/', instructionsController.instructionsList);

/* CREATE INVOICES */
router.post('/instructions/createInvoice/:invoices', instructionsController.createInvoice);

module.exports = router;