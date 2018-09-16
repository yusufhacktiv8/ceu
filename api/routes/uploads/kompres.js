const express = require('express');
const UploadKompreController = require('../../controllers/uploads/komprescores.js');
const { isAuthorizedAsIn } = require('../../helpers/AuthUtils');

const router = express.Router();

router.get('/', isAuthorizedAsIn(['ADMIN', 'CONTINUING_ASSESMENT']), UploadKompreController.findAll);
router.post('/', isAuthorizedAsIn(['ADMIN', 'CONTINUING_ASSESMENT']), UploadKompreController.create);
router.put('/:scoreId', isAuthorizedAsIn(['ADMIN', 'CONTINUING_ASSESMENT']), UploadKompreController.update);
router.delete('/:scoreId', isAuthorizedAsIn(['ADMIN', 'CONTINUING_ASSESMENT']), UploadKompreController.destroy);

module.exports = router;
