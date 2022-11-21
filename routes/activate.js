const express = require('express');
const router = express.Router();
const activateUserController = require('../controllers/activateUserController');

router.get('/:user/:hash', activateUserController.handleUserActivation);

module.exports = router;