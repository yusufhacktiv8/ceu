const express = require('express');

const router = express.Router();
const CourseController = require('../controllers/courses');
const { isAuthorizedAsIn } = require('../../helpers/AuthUtils');

/* GET users listing. */
router.get('/', isAuthorizedAsIn(['ADMIN', 'STUDENT']), CourseController.findAll);

module.exports = router;
