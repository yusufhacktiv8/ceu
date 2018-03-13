const express = require('express');
const PengampuController = require('../controllers/pengampus.js');

const router = express.Router();

router.get('/', PengampuController.findAll);
router.get('/:pengampuId', PengampuController.findOne);
router.post('/', PengampuController.create);
router.put('/:pengampuId', PengampuController.update);
router.delete('/:pengampuId', PengampuController.destroy);

module.exports = router;
