var express  = require('express');
var router = express.Router();
var tokenController = require('../controllers/token.js');

router.get('/confirmation/:token', tokenController.confirmationGet);

module.exports = router;