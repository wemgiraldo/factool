var express = require('express');
var router = express.Router();
var configController = require("../../controllers/configController");

router.get('/config', function(req, res) {
    res.redirect('/config/user');
});

router.get('/config/user', configController.listUser);

router.get('/config/user/edit/:userId?', configController.editUser_get);

router.post('/config/user/edit/:userId', configController.editUser_post);

router.get('/config/user/:userId/delete', configController.deleteUser);

router.post('/config/user/edit', configController.newUser_post);

router.get('/config/settings', configController.settings_get);

router.post('/config/settings', configController.settings_post);

module.exports = router;