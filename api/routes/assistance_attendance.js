const express = require('express');
const AssistanceController = require('../controllers/assistances.js');

const router = express.Router();

router.get('/:studentId', AssistanceController.attendance);

module.exports = router;
