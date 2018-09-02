const express = require('express');
const UploadScoreController = require('../../controllers/uploads/scores.js');
const { isAuthorizedAs } = require('../../helpers/AuthUtils');

const router = express.Router();

router.post('/', isAuthorizedAs('ADMIN'), UploadScoreController.upload);
router.get('/', UploadScoreController.download);

module.exports = router;
