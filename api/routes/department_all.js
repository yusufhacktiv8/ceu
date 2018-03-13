const express = require('express');

const router = express.Router();
const DepartmentController = require('../controllers/departments.js');

router.get('/', DepartmentController.all);

module.exports = router;
