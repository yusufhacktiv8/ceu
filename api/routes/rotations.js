const express = require('express');
const RotationController = require('../controllers/reports/rotations.js');
const { isAuthorizedAs } = require('../helpers/AuthUtils');

const router = express.Router();

router.get('/', isAuthorizedAs('ADMIN'), RotationController.findAll);
router.get('/download', isAuthorizedAs('ADMIN'), RotationController.download);

module.exports = router;
