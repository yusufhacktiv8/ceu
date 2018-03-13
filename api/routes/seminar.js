const express = require('express');
const SeminarController = require('../controllers/seminars.js');

const router = express.Router();

router.get('/', SeminarController.findAll);
router.get('/:seminarId', SeminarController.findOne);
router.post('/', SeminarController.create);
router.put('/:seminarId', SeminarController.update);
router.delete('/:seminarId', SeminarController.destroy);

router.get('/:seminarId/participants', SeminarController.findAllParticipants);

module.exports = router;
