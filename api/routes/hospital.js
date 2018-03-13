const express = require('express');
const HospitalController = require('../controllers/hospitals.js');
const HospitalDepartmentController = require('../controllers/hospitaldepartments.js');

const router = express.Router();

router.get('/', HospitalController.findAll);
router.get('/:hospitalId', HospitalController.findOne);
router.post('/', HospitalController.create);
router.put('/:hospitalId', HospitalController.update);
router.delete('/:hospitalId', HospitalController.destroy);

router.get('/:hospitalId/departments', HospitalDepartmentController.findAll);

module.exports = router;
