const express = require('express');
const UploadScoreController = require('../../controllers/uploads/scores.js');
const { isAuthorizedAsIn } = require('../../helpers/AuthUtils');

const router = express.Router();

router.post('/', isAuthorizedAsIn(['ADMIN', 'CONTINUING_ASSESMENT']), UploadScoreController.upload);
router.get('/', isAuthorizedAsIn(['ADMIN', 'CONTINUING_ASSESMENT']), UploadScoreController.download);

module.exports = router;
