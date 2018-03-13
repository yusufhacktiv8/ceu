const express = require('express');
const UserController = require('../controllers/users.js');

const router = express.Router();

router.get('/', UserController.findAll);
router.get('/:userId', UserController.findOne);
router.post('/', UserController.create);
router.put('/:userId', UserController.update);
router.delete('/:userId', UserController.destroy);

module.exports = router;
