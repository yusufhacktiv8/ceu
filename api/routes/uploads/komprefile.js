const express = require('express');
const UploadKompreController = require('../../controllers/uploads/komprescores.js');
const { isAuthorizedAsIn } = require('../../helpers/AuthUtils');

const router = express.Router();

router.post('/', isAuthorizedAsIn(['ADMIN', 'CONTINUING_ASSESMENT']), UploadKompreController.upload);
router.get('/', isAuthorizedAsIn(['ADMIN', 'CONTINUING_ASSESMENT']), UploadKompreController.download);

module.exports = router;
