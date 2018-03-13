const express = require('express');
const AppPropController = require('../controllers/app_props.js');

const router = express.Router();

router.get('/', AppPropController.findAll);
router.get('/:appPropId', AppPropController.findOne);
router.post('/', AppPropController.create);
router.put('/:appPropId', AppPropController.update);
router.delete('/:appPropId', AppPropController.destroy);

module.exports = router;
