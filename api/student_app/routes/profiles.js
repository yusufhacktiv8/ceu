const express = require('express');

const router = express.Router();
const ProfileController = require('../controllers/profiles');
const { isAuthorizedAsIn } = require('../../helpers/AuthUtils');

router.get('/', isAuthorizedAsIn(['ADMIN', 'STUDENT']), ProfileController.findStudent);

module.exports = router;

