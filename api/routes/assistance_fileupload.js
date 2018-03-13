const express = require('express');
const AssistanceController = require('../controllers/assistances.js');

const router = express.Router();

router.post('/:assistanceId', AssistanceController.fileUpload);

module.exports = router;
