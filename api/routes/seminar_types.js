const express = require('express');
const SeminarTypeController = require('../controllers/seminar_types.js');

const router = express.Router();

router.get('/', SeminarTypeController.findAll);
router.get('/:seminarTypeId', SeminarTypeController.findOne);
router.post('/', SeminarTypeController.create);
router.put('/:seminarTypeId', SeminarTypeController.update);
router.delete('/:seminarTypeId', SeminarTypeController.destroy);

module.exports = router;
