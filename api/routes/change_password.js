const express = require('express');
const UserController = require('../controllers/users.js');

const router = express.Router();

router.put('/:userId', UserController.changePassword);

module.exports = router;
