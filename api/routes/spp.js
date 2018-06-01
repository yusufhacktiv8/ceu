const express = require('express');
const SppController = require('../controllers/spps.js');

const router = express.Router();

router.put('/:sppId', SppController.update);
router.delete('/:sppId', SppController.destroy);
router.post('/:sppId', SppController.upload);

module.exports = router;
