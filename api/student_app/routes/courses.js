const express = require('express');

const router = express.Router();
const CourseController = require('../controllers/courses');
const { isAuthorizedAsIn } = require('../../helpers/AuthUtils');

/* GET users listing. */
router.get('/', isAuthorizedAsIn(['ADMIN', 'STUDENT']), CourseController.findAll);
router.get('/:courseId', isAuthorizedAsIn(['ADMIN', 'STUDENT']), CourseController.findOne);
router.get('/:courseId/sgls', isAuthorizedAsIn(['ADMIN', 'STUDENT']), CourseController.findSgls);
router.get('/:courseId/portofolios', isAuthorizedAsIn(['ADMIN', 'STUDENT']), CourseController.findPortofolios);
router.get('/:courseId/seminars', isAuthorizedAsIn(['ADMIN', 'STUDENT']), CourseController.findSeminars);
router.get('/:courseId/problems', isAuthorizedAsIn(['ADMIN', 'STUDENT']), CourseController.findProblems);
// router.get('/', CourseController.findAll);

module.exports = router;
