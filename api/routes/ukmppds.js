const express = require('express');
const UkmppdController = require('../controllers/ukmppds.js');

const router = express.Router();

router.put('/:ukmppdId', UkmppdController.update);
router.delete('/:ukmppdId', UkmppdController.destroy);

module.exports = router;
