const express = require('express');
const HospitalController = require('../controllers/hospitals.js');

const router = express.Router();

router.get('/', HospitalController.findSchedule);
router.get('/hospitalschedules', HospitalController.hospitalSchedule);
router.get('/hospitalstudents/:hospitalId/:departmentId', HospitalController.hospitalStudents);

module.exports = router;
