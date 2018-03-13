const express = require('express');
const SglTypeController = require('../controllers/sgl_types.js');

const router = express.Router();

router.get('/', SglTypeController.findAll);
router.get('/:sglTypeId', SglTypeController.findOne);
router.post('/', SglTypeController.create);
router.put('/:sglTypeId', SglTypeController.update);
router.delete('/:sglTypeId', SglTypeController.destroy);

module.exports = router;
