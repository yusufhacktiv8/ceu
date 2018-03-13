const express = require('express');
const DocentController = require('../controllers/docents.js');

const router = express.Router();

router.get('/', DocentController.docentsByHD);

module.exports = router;
