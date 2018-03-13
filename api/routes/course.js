
const express = require('express');

const router = express.Router();
const CourseController = require('../controllers/courses');

router.get('/:courseId', CourseController.findOne);
router.get('/:courseId/problems', CourseController.findCourseProblems);
router.put('/:courseId', CourseController.update);
router.put('/:courseId/pending', CourseController.pending);
router.put('/:courseId/unpending', CourseController.unPending);
router.delete('/:courseId', CourseController.delete);
router.post('/:courseId/scores', CourseController.addScore);
router.get('/:courseId/scores', CourseController.findScores);
router.post('/:courseId/courseproblems', CourseController.addCourseProblem);
router.get('/:courseId/courseproblems', CourseController.findCourseProblems);
router.post('/:courseId/portofolios', CourseController.addPortofolio);
router.get('/:courseId/portofolios', CourseController.findPortofolios);
router.post('/:courseId/sgls', CourseController.addSgl);
router.get('/:courseId/sgls', CourseController.findSgls);
router.get('/:courseId/courseseminars', CourseController.findCourseSeminars);

module.exports = router;
