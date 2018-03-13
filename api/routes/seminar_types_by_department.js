const express = require('express');
const SeminarTypeController = require('../controllers/seminar_types.js');

const router = express.Router();

router.get('/', SeminarTypeController.seminarTypesByDepartment);

module.exports = router;
