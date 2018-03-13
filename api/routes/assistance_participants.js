const express = require('express');
const AssistanceController = require('../controllers/assistances.js');

const router = express.Router();

router.get('/bystudent/:studentId', AssistanceController.findAssistanceParticipantsByStudent);

module.exports = router;
