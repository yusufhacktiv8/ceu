const express = require('express');
const RoleController = require('../controllers/roles.js');

const router = express.Router();

router.get('/', RoleController.findAll);
router.get('/:roleId', RoleController.findOne);
router.post('/', RoleController.create);
router.put('/:roleId', RoleController.update);
router.delete('/:roleId', RoleController.destroy);

module.exports = router;
