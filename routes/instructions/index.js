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

/* CLOSE NOMINA PAGO */
router.post('/instructions/closeNominaPago/', procesopagoController.closeNominaPago);

/* SET AS PAID */
router.post('/instructions/setAsPaid/', instructionsController.setAsPaid);

/* SET AS INVOICED */
router.post('/instructions/setAsInvoiced/', instructionsController.setAsInvoiced);


/* CREATE A NEW PROCESO DE PAGO */
router.post('/instructions/createProcesoPago/', procesopagoController.createProcesoPago);

/* SHOW A PROCESO DE PAGO */
router.get('/instructions/showProcesoPago/:id/:idCompany', procesopagoController.showProcesoPago);


/* update log */
router.post('/instructions/updateLog/', instructionsController.updateLog);

/* update log proceso pago*/
router.post('/instructions/updateLogPago/', procesopagoController.updateLog);

/* GET BANK ACCOUNT */
router.get('/instructions/getBankAccount/', procesopagoController.getBankAccount);



module.exports = router;