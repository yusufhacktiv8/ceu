const express = require('express');
const UploadScoreController = require('../../controllers/uploads/scores.js');
const { isAuthorizedAsIn } = require('../../helpers/AuthUtils');

const router = express.Router();

router.get('/', isAuthorizedAsIn(['ADMIN', 'CONTINUING_ASSESMENT']), UploadScoreController.findAll);
router.post('/', isAuthorizedAsIn(['ADMIN', 'CONTINUING_ASSESMENT']), UploadScoreController.create);
router.put('/:scoreId', isAuthorizedAsIn(['ADMIN', 'CONTINUING_ASSESMENT']), UploadScoreController.update);
router.delete('/:scoreId', isAuthorizedAsIn(['ADMIN', 'CONTINUING_ASSESMENT']), UploadScoreController.destroy);

module.exports = router;
