const express = require('express');
const ProfileController = require('../controllers/profiles');
const { isAuthorizedAs } = require('../../helpers/AuthUtils');

const router = express.Router();

router.put('/', isAuthorizedAs('ADMIN'), ProfileController.changePassword);

module.exports = router;
