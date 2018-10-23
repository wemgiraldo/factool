var express = require('express');
var router = express.Router();
var instructionsController = require("../../controllers/instructionsController");


/* LIST OF INSTRUCTIONS */
router.get('/instructions/list/', instructionsController.instructionsList);

/* CREATE INVOICES */
router.post('/instructions/createInvoice/:invoices', instructionsController.createInvoice);

/* CREATE NOMINA PAGO */
router.post('/instructions/createNominaPago/:invoices', instructionsController.createNominaPago);

/* ACCEPT INVOICES */
router.post('/instructions/acceptInvoice/:invoices', instructionsController.acceptInvoice);

/* REJECT INVOICES */
router.post('/instructions/rejectInvoice/:invoices', instructionsController.rejectInvoice);

/* SET PAID INVOICES */
router.post('/instructions/setpaidInvoice/:invoices', instructionsController.createPayment);

/* LIST OF NOMINA PAGOS */
router.get('/instructions/nominapagos/', instructionsController.nominaPagos);

/* LIST OF NOTIFICA PAGOS */
router.get('/instructions/notificapagos/', instructionsController.nominaPagos);

/* CREATE INVOICES */
router.post('/instructions/createNotificaPagos/:invoices', instructionsController.createInvoice);


module.exports = router;