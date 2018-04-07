const express = require('express');
const RoleController = require('../controllers/roles.js');
const { isAuthorizedAs } = require('../helpers/AuthUtils');

const router = express.Router();

router.get('/', isAuthorizedAs('ADMIN'), RoleController.findAll);
router.get('/:roleId', RoleController.findOne);
router.post('/', RoleController.create);
router.put('/:roleId', RoleController.update);
router.delete('/:roleId', RoleController.destroy);

module.exports = router;
