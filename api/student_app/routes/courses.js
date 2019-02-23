const express = require('express');

const router = express.Router();
const CourseController = require('../controllers/courses');
const { isAuthorizedAsIn } = require('../../helpers/AuthUtils');

/* GET users listing. */
router.get('/', isAuthorizedAsIn(['STUDENT']), CourseController.findAll);
router.get('/:courseId', isAuthorizedAsIn(['STUDENT']), CourseController.findOne);
router.get('/:courseId/sgls', isAuthorizedAsIn(['STUDENT']), CourseController.findSgls);
router.get('/:courseId/portofolios', isAuthorizedAsIn(['STUDENT']), CourseController.findPortofolios);
router.get('/:courseId/seminars', isAuthorizedAsIn(['STUDENT']), CourseController.findSeminars);
router.get('/:courseId/problems', isAuthorizedAsIn(['STUDENT']), CourseController.findProblems);
// router.get('/', CourseController.findAll);

module.exports = router;
