const express = require('express');
const UserController = require('../controllers/users.js');
const { isAuthorizedAs } = require('../helpers/AuthUtils');

const router = express.Router();

router.put('/:userId', isAuthorizedAs('ADMIN'), UserController.changePassword);

module.exports = router;
