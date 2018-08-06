const express = require('express');
const AssistanceTopicController = require('../controllers/assistance_topics.js');

const router = express.Router();

router.get('/', AssistanceTopicController.assistanceTopicsByDepartment);

module.exports = router;
