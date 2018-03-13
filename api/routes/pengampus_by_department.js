const express = require('express');
const PengampuController = require('../controllers/pengampus.js');

const router = express.Router();

router.get('/', PengampuController.pengampusByDepartment);

module.exports = router;
