const express = require('express');

const router = express.Router();
const { isAuthorizedAs, isAuthorizedAsIn } = require('../helpers/AuthUtils');
const DepartmentController = require('../controllers/departments.js');

router.get('/', isAuthorizedAsIn(['ADMIN', 'KOMKORDIK', 'BAKORDIK', 'SEMINAR', 'ASSISTANCE', 'SGL', 'PORTOFOLIO']), DepartmentController.findAll);
router.post('/', isAuthorizedAs('ADMIN'), DepartmentController.create);
router.get('/:departmentId', isAuthorizedAs('ADMIN'), DepartmentController.findOne);
router.put('/:departmentId', isAuthorizedAs('ADMIN'), DepartmentController.update);
router.delete('/:departmentId', isAuthorizedAs('ADMIN'), DepartmentController.delete);

module.exports = router;
