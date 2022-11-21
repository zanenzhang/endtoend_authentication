const express = require('express');
const router = express.Router();
const resetPassController = require('../controllers/resetPassController');

router.post('/', resetPassController.handleResetPassword);

module.exports = router;