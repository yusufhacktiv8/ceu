const express = require('express');
const PortofolioTypeController = require('../controllers/portofolio_types.js');

const router = express.Router();

router.get('/', PortofolioTypeController.portofolioTypesByDepartment);

module.exports = router;
