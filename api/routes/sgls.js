const express = require('express');
const SglController = require('../controllers/sgls.js');

const router = express.Router();

router.put('/:sglId', SglController.update);
router.delete('/:sglId', SglController.destroy);

module.exports = router;
