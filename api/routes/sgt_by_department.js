const express = require('express');
const SglTypeController = require('../controllers/sgl_types.js');

const router = express.Router();

router.get('/', SglTypeController.sglTypesByDepartment);

module.exports = router;
