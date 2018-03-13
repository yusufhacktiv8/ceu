const express = require('express');
const SupervisorController = require('../controllers/supervisors.js');

const router = express.Router();

router.get('/', SupervisorController.findAndCountAll);
router.get('/:supervisorId', SupervisorController.findOne);
router.post('/', SupervisorController.create);
router.put('/:supervisorId', SupervisorController.update);
router.delete('/:supervisorId', SupervisorController.destroy);

module.exports = router;
