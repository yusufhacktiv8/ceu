const express = require('express');
const KompreTypeController = require('../controllers/kompre_types.js');

const router = express.Router();

router.get('/', KompreTypeController.findAll);
router.get('/:kompreTypeId', KompreTypeController.findOne);
router.post('/', KompreTypeController.create);
router.put('/:kompreTypeId', KompreTypeController.update);
router.delete('/:kompreTypeId', KompreTypeController.destroy);

module.exports = router;
