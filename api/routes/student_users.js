const express = require('express');
const StudentUserController = require('../controllers/student_users.js');

const router = express.Router();

router.get('/', StudentUserController.findAll);
router.get('/:studentUserId', StudentUserController.findOne);
router.post('/', StudentUserController.create);
router.put('/:studentUserId', StudentUserController.update);
router.delete('/:studentUserId', StudentUserController.destroy);

module.exports = router;
