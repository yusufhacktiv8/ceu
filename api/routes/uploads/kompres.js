const express = require('express');
const UploadKompreController = require('../../controllers/uploads/komprescores.js');
const { isAuthorizedAsIn } = require('../../helpers/AuthUtils');

const router = express.Router();

router.get('/', isAuthorizedAsIn(['ADMIN', 'CONTINUING_ASSESMENT']), UploadKompreController.findAll);
router.post('/', isAuthorizedAsIn(['ADMIN', 'CONTINUING_ASSESMENT']), UploadKompreController.create);
router.put('/:kompreId', isAuthorizedAsIn(['ADMIN', 'CONTINUING_ASSESMENT']), UploadKompreController.update);
router.delete('/:kompreId', isAuthorizedAsIn(['ADMIN', 'CONTINUING_ASSESMENT']), UploadKompreController.destroy);

module.exports = router;
