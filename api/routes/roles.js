const express = require('express');
const RoleController = require('../controllers/roles.js');
const { isAuthorizedAs } = require('../helpers/AuthUtils');

const router = express.Router();

router.get('/', isAuthorizedAs('ADMIN'), RoleController.findAll);
router.get('/:roleId', isAuthorizedAs('ADMIN'), RoleController.findOne);
router.post('/', isAuthorizedAs('ADMIN'), RoleController.create);
router.put('/:roleId', isAuthorizedAs('ADMIN'), RoleController.update);
router.delete('/:roleId', isAuthorizedAs('ADMIN'), RoleController.destroy);

module.exports = router;
