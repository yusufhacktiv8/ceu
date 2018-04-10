const express = require('express');
const UserController = require('../controllers/users.js');
const { isAuthorizedAs } = require('../helpers/AuthUtils');

const router = express.Router();

router.get('/', isAuthorizedAs('ADMIN'), UserController.findAll);
router.get('/:userId', isAuthorizedAs('ADMIN'), UserController.findOne);
router.post('/', isAuthorizedAs('ADMIN'), UserController.create);
router.put('/:userId', isAuthorizedAs('ADMIN'), UserController.update);
router.delete('/:userId', isAuthorizedAs('ADMIN'), UserController.destroy);

module.exports = router;
