const express = require('express');
const YudisiumCandidateController = require('../controllers/yudisiumcandidates.js');
const { isAuthorizedAs } = require('../helpers/AuthUtils');

const router = express.Router();

router.get('/', isAuthorizedAs('ADMIN'), YudisiumCandidateController.findAll);
router.get('/:yudisiumCandidateId', isAuthorizedAs('ADMIN'), YudisiumCandidateController.findOne);
router.post('/', isAuthorizedAs('ADMIN'), YudisiumCandidateController.create);
// router.put('/:yudisiumCandidateId', isAuthorizedAs('ADMIN'), YudisiumCandidateController.update);
// router.delete('/:yudisiumCandidateId', isAuthorizedAs('ADMIN'), YudisiumCandidateController.destroy);
router.put('/removein', isAuthorizedAs('ADMIN'), YudisiumCandidateController.removeIn);

module.exports = router;
