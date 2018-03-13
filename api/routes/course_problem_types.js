const express = require('express');
const CourseProblemTypeController = require('../controllers/course_problem_types.js');

const router = express.Router();

router.get('/', CourseProblemTypeController.findAll);
router.get('/:courseProblemTypeId', CourseProblemTypeController.findOne);
router.post('/', CourseProblemTypeController.create);
router.put('/:courseProblemTypeId', CourseProblemTypeController.update);
router.delete('/:courseProblemTypeId', CourseProblemTypeController.destroy);

module.exports = router;
