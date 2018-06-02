const express = require('express');
const KrsController = require('../controllers/krss.js');
const { isAuthorizedAsIn } = require('../helpers/AuthUtils');

const router = express.Router();

router.put('/:krsId', isAuthorizedAsIn(['ADMIN']), KrsController.update);
router.delete('/:krsId', isAuthorizedAsIn(['ADMIN']), KrsController.destroy);
router.post('/:krsId', isAuthorizedAsIn(['ADMIN']), KrsController.upload);
router.put('/:krsId/deletefile', isAuthorizedAsIn(['ADMIN']), KrsController.deleteFile);

module.exports = router;
