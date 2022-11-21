const express = require('express');
const router = express.Router();
const inputNewPassController = require('../controllers/inputNewPassController');

router.post('/', inputNewPassController.handleInputNewPassword);

module.exports = router;