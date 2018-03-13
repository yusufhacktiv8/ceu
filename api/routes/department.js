const express = require('express');

const router = express.Router();
const DepartmentController = require('../controllers/departments.js');

router.get('/', DepartmentController.findAll);
router.post('/', DepartmentController.create);
router.get('/:departmentId', DepartmentController.findOne);
router.put('/:departmentId', DepartmentController.update);
router.delete('/:departmentId', DepartmentController.delete);

module.exports = router;
