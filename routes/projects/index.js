var express = require('express');
var router = express.Router();
var projectsController = require("../../controllers/projectsController");


/* ACTIVE PROJECT LIST */
router.get('/projects/active', projectsController.activeProjectsList);

/* ALL PROJECT LIST */
router.get('/projects/all', projectsController.allProjectsList);

/* DEV STATUS */
router.get('/projects/dev/status', projectsController.getDevStatus);

/* PROJECT SHOW */
router.get('/projects/one/:id', projectsController.show);

/* EXCUTIVE SUMMARY SHOW */
router.get('/projects/one/:id', projectsController.showExecSumm);

/* EDIT CREATE PROJECT */
router.get('/projects/edit/:id?', projectsController.edit_get);
router.post('/projects/edit/:id?', projectsController.edit_post);

/* SEND PROJECT */
router.get('/projects/send/:id', projectsController.send);



module.exports = router;