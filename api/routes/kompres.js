const express = require('express');
const KompreController = require('../controllers/kompres.js');

const router = express.Router();

router.put('/:kompreId', KompreController.update);
router.delete('/:kompreId', KompreController.destroy);

module.exports = router;
