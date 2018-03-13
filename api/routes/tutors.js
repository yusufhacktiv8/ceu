const express = require('express');
const TutorController = require('../controllers/tutors.js');

const router = express.Router();

router.get('/', TutorController.findAndCountAll);
router.get('/:tutorId', TutorController.findOne);
router.post('/', TutorController.create);
router.put('/:tutorId', TutorController.update);
router.delete('/:tutorId', TutorController.destroy);

module.exports = router;
