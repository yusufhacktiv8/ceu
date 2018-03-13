const express = require('express');

const router = express.Router();
const StudentController = require('../controllers/students');

/* GET users listing. */
router.get('/', StudentController.getStatusCount);

module.exports = router;
