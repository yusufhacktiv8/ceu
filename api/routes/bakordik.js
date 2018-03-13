const express = require('express');
const BakordikController = require('../controllers/bakordik.js');

const router = express.Router();

router.get('/initiatestudents', BakordikController.findInitiateStudentCourses);

module.exports = router;
