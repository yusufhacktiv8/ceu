const express = require('express');
const AssistanceController = require('../controllers/assistances.js');

const router = express.Router();

router.get('/', AssistanceController.findAll);
router.get('/:assistanceId', AssistanceController.findOne);
router.post('/', AssistanceController.create);
router.put('/:assistanceId', AssistanceController.update);
router.delete('/:assistanceId', AssistanceController.destroy);

router.get('/:assistanceId/participants', AssistanceController.findAllParticipants);

module.exports = router;
