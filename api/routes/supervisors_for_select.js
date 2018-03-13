const express = require('express');
const SupervisorController = require('../controllers/supervisors.js');

const router = express.Router();

router.get('/', SupervisorController.findAll);

module.exports = router;
