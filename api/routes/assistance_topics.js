const express = require('express');
const AsistanceTopicController = require('../controllers/assistance_topics.js');

const router = express.Router();

router.get('/', AsistanceTopicController.findAll);
router.get('/:asistanceTopicId', AsistanceTopicController.findOne);
router.post('/', AsistanceTopicController.create);
router.put('/:asistanceTopicId', AsistanceTopicController.update);
router.delete('/:asistanceTopicId', AsistanceTopicController.destroy);

module.exports = router;
