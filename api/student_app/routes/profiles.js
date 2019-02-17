const express = require('express');

const router = express.Router();
const ProfileController = require('../controllers/profiles');
const { isAuthorizedAsIn } = require('../../helpers/AuthUtils');

router.get('/', isAuthorizedAsIn(['ADMIN', 'STUDENT']), ProfileController.findStudent);
router.put('/changepassword', isAuthorizedAsIn(['ADMIN', 'STUDENT']), ProfileController.changePassword);

module.exports = router;

