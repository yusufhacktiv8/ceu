const express = require('express');
const UploadScoreController = require('../../controllers/uploads/scores.js');
const { isAuthorizedAs } = require('../../helpers/AuthUtils');

const router = express.Router();

router.get('/', isAuthorizedAs('ADMIN'), UploadScoreController.findAll);
router.get('/:scoreId', isAuthorizedAs('ADMIN'), UploadScoreController.findOne);
router.post('/', isAuthorizedAs('ADMIN'), UploadScoreController.create);
router.put('/:scoreId', isAuthorizedAs('ADMIN'), UploadScoreController.update);
router.delete('/:scoreId', isAuthorizedAs('ADMIN'), UploadScoreController.destroy);

module.exports = router;
