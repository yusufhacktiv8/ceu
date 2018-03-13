const express = require('express');
const YscController = require('../controllers/yudisiumchecklists.js');

const router = express.Router();

router.get('/findbystudent/:studentId', YscController.findByStudent);
router.get('/portofolios/:studentId', YscController.findPortofolios);
router.put('/:yscId', YscController.update);

module.exports = router;
