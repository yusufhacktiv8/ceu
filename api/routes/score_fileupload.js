const express = require('express');
const ScoreUploadController = require('../controllers/score_fileupload.js');

const router = express.Router();

router.post('/pretest', ScoreUploadController.preTestUpload);
router.post('/posttest', ScoreUploadController.postTestUpload);

module.exports = router;
