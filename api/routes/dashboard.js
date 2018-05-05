const express = require('express');
const DashboardController = require('../controllers/dashboard.js');
const { isAuthorizedAs } = require('../helpers/AuthUtils');

const router = express.Router();

// router.get('/mppdcount', isAuthorizedAs('ADMIN'), DashboardController.mppdCountByLevel);
router.get('/mppdcount', DashboardController.mppdCountByLevel);
router.get('/studentcount', DashboardController.studentCountByLevel);
router.get('/studentstatuscount', DashboardController.studentStatusCountByLevel);

module.exports = router;
