const express = require('express');

const router = express.Router();
const StudentController = require('../controllers/students');
const { isAuthorizedAs, isAuthorizedAsIn } = require('../helpers/AuthUtils');

/* GET users listing. */
router.get('/', isAuthorizedAsIn(['ADMIN', 'EMPLOYEE', 'SGL', 'PORTOFOLIO', 'KOMKORDIK', 'CONTINUING_ASSESMENT']), StudentController.findAll);
router.get('/:studentId', isAuthorizedAsIn(['ADMIN', 'SGL', 'PORTOFOLIO', 'KOMKORDIK']), StudentController.findOne);
router.post('/', isAuthorizedAs('ADMIN'), StudentController.create);
router.put('/:studentId', isAuthorizedAs('ADMIN'), StudentController.update);
router.delete('/:studentId', isAuthorizedAs('ADMIN'), StudentController.delete);
router.post('/:studentId/courses', isAuthorizedAs('ADMIN'), StudentController.addCourses);
router.get('/:studentId/courses', isAuthorizedAsIn(['ADMIN', 'SGL', 'PORTOFOLIO', 'KOMKORDIK']), StudentController.findCourses);
router.delete('/:studentId/courses/:courseId', isAuthorizedAs('ADMIN'), StudentController.deleteCourse);
router.get('/:studentId/scores', isAuthorizedAs('ADMIN'), StudentController.findScores);
router.post('/:studentId/kompres', isAuthorizedAs('ADMIN'), StudentController.addKompre);
router.get('/:studentId/kompres', isAuthorizedAs('ADMIN'), StudentController.findKompres);
router.post('/:studentId/ukmppds', isAuthorizedAs('ADMIN'), StudentController.addUkmppd);
router.get('/:studentId/ukmppds', isAuthorizedAs('ADMIN'), StudentController.findUkmppds);
router.post('/:studentId/uploadfile/ijazah', isAuthorizedAs('ADMIN'), StudentController.ijazahUpload);
router.put('/:studentId/uploadfile/ijazah', isAuthorizedAs('ADMIN'), StudentController.deleteIjazahFile);
router.post('/:studentId/uploadfile/ijazahakhir', isAuthorizedAs('ADMIN'), StudentController.ijazahAkhirUpload);
router.put('/:studentId/uploadfile/ijazahakhir', isAuthorizedAs('ADMIN'), StudentController.deleteIjazahAkhirFile);
router.get('/:studentId/spps', isAuthorizedAsIn(['ADMIN']), StudentController.findSpps);
router.post('/:studentId/spps', isAuthorizedAsIn(['ADMIN']), StudentController.addSpp);
router.get('/:studentId/krss', isAuthorizedAsIn(['ADMIN']), StudentController.findKrss);
router.post('/:studentId/krss', isAuthorizedAsIn(['ADMIN']), StudentController.addKrs);

module.exports = router;
