const express = require('express');
const HospitalUserController = require('../controllers/hospital_users.js');

const router = express.Router();

router.get('/', HospitalUserController.findAll);
router.get('/:hospitalUserId', HospitalUserController.findOne);
router.post('/', HospitalUserController.create);
router.put('/:hospitalUserId', HospitalUserController.update);
router.delete('/:hospitalUserId', HospitalUserController.destroy);

module.exports = router;
