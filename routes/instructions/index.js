var express = require('express');
var router = express.Router();
var instructionsController = require("../../controllers/instructionsController");
var procesopagoController = require("../../controllers/procesopagoController");


/* LIST OF INSTRUCTIONS DEBTOR */
router.get('/instructions/debtor/', instructionsController.listInstructionsD);

/* LIST OF INSTRUCTIONS CREDITOR */
router.get('/instructions/creditor/', instructionsController.listInstructionsC);

/* LIST OF PROCESOS DE PAGOS */
router.get('/instructions/listProcesoPago/', procesopagoController.listProcesoPago);



/* CREATE INVOICES */
router.post('/instructions/createInvoice/', instructionsController.createInvoice);

/* CREATE NOMINA PAGO */
router.post('/instructions/createNominaPago/', procesopagoController.createNominaPago);

/* CREATE A NEW PROCESO DE PAGO */
router.post('/instructions/closeNominaPago/', procesopagoController.closeNominaPago);




/* CREATE A NEW PROCESO DE PAGO */
router.post('/instructions/createProcesoPago/', procesopagoController.createProcesoPago);

/* SHOW A PROCESO DE PAGO */
router.get('/instructions/showProcesoPago/:id/:idCompany', procesopagoController.showProcesoPago);




/* ACCEPT INVOICES */
router.post('/instructions/acceptInvoice/', instructionsController.acceptInvoice);

/* REJECT INVOICES */
router.post('/instructions/rejectInvoice/', instructionsController.rejectInvoice);

/* update log */
router.post('/instructions/updateLog/', instructionsController.updateLog);


module.exports = router;