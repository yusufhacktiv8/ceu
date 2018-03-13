const express = require('express');
const TutorController = require('../controllers/tutors.js');

const router = express.Router();

router.get('/', TutorController.findAll);

module.exports = router;
