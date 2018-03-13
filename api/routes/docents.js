const express = require('express');
const DocentController = require('../controllers/docents.js');

const router = express.Router();

router.get('/', DocentController.findAll);
router.get('/:docentId', DocentController.findOne);
router.post('/', DocentController.create);
router.put('/:docentId', DocentController.update);
router.delete('/:docentId', DocentController.destroy);

module.exports = router;
