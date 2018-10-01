var express = require('express');
var router = express.Router();
var settingsprjController = require("../../controllers/settingsprjController");

router.get('/settingsprj/:config_name', settingsprjController.settings_get);
router.post('/settingsprj/:config_name', settingsprjController.settings_post);

module.exports = router;