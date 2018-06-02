const express = require('express');
const KrsController = require('../controllers/krss.js');

const router = express.Router();

router.put('/:krsId', KrsController.update);
router.delete('/:krsId', KrsController.destroy);
router.post('/:krsId', KrsController.upload);
router.put('/:krsId/deletefile', KrsController.deleteFile);

module.exports = router;
