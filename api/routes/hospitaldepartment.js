const express = require('express');
const HospitalDepartmentController = require('../controllers/hospitaldepartments.js');

const router = express.Router();

router.get('/', HospitalDepartmentController.findAll);
router.get('/:hospitalDepartmentId', HospitalDepartmentController.findOne);
router.post('/', HospitalDepartmentController.create);
router.put('/:hospitalDepartmentId', HospitalDepartmentController.update);
router.delete('/:hospitalDepartmentId', HospitalDepartmentController.destroy);

module.exports = router;
