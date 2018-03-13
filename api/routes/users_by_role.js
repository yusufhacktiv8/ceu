const express = require('express');
const UserController = require('../controllers/users.js');

const router = express.Router();

router.get('/', UserController.usersByRole);

module.exports = router;
