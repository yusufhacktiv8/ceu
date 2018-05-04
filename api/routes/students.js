const express = require('express');

const router = express.Router();
const StudentController = require('../controllers/students');
const { isAuthorizedAs, isAuthorizedAsIn } = require('../helpers/AuthUtils');

/* GET users listing. */
router.get('/', isAuthorizedAsIn(['ADMIN', 'SGL', 'PORTOFOLIO']), StudentController.findAll);
router.get('/:studentId', isAuthorizedAs('ADMIN'), StudentController.findOne);
router.post('/', isAuthorizedAs('ADMIN'), StudentController.create);
router.put('/:studentId', isAuthorizedAs('ADMIN'), StudentController.update);
router.delete('/:studentId', isAuthorizedAs('ADMIN'), StudentController.delete);
router.post('/:studentId/courses', isAuthorizedAs('ADMIN'), StudentController.addCourses);
router.get('/:studentId/courses', isAuthorizedAsIn(['ADMIN', 'SGL', 'PORTOFOLIO']), StudentController.findCourses);
router.delete('/:studentId/courses/:courseId', isAuthorizedAs('ADMIN'), StudentController.deleteCourse);
router.get('/:studentId/scores', isAuthorizedAs('ADMIN'), StudentController.findScores);
router.post('/:studentId/kompres', isAuthorizedAs('ADMIN'), StudentController.addKompre);
router.get('/:studentId/kompres', isAuthorizedAs('ADMIN'), StudentController.findKompres);
router.post('/:studentId/uploadfile/krs', isAuthorizedAs('ADMIN'), StudentController.krsUpload);

module.exports = router;
