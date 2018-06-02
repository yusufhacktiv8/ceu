const express = require('express');
const SppController = require('../controllers/spps.js');
const { isAuthorizedAsIn } = require('../helpers/AuthUtils');

const router = express.Router();

router.put('/:sppId', isAuthorizedAsIn(['ADMIN']), SppController.update);
router.delete('/:sppId', isAuthorizedAsIn(['ADMIN']), SppController.destroy);
router.post('/:sppId', isAuthorizedAsIn(['ADMIN']), SppController.upload);
router.put('/:sppId/deletefile', isAuthorizedAsIn(['ADMIN']), SppController.deleteFile);

module.exports = router;
