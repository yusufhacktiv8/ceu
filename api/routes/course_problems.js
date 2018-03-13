const express = require('express');
const CourseProblemController = require('../controllers/course_problems.js');

const router = express.Router();

router.put('/:courseProblemId', CourseProblemController.update);
router.delete('/:courseProblemId', CourseProblemController.destroy);

module.exports = router;
