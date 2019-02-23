const express = require('express');

const router = express.Router();
const ProfileController = require('../controllers/profiles');
const { isAuthorizedAsIn } = require('../../helpers/AuthUtils');

router.get('/', isAuthorizedAsIn(['STUDENT']), ProfileController.findStudent);
router.put('/changepassword', isAuthorizedAsIn(['STUDENT']), ProfileController.changePassword);

module.exports = router;

