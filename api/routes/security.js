const express = require('express');
const SecurityController = require('../controllers/security.js');

const router = express.Router();

router.post('/signin', SecurityController.signIn);

module.exports = router;
