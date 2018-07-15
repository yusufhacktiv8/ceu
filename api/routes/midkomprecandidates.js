const express = require('express');
const MidKompreCandidateController = require('../controllers/midkomprecandidates.js');
const { isAuthorizedAs } = require('../helpers/AuthUtils');

const router = express.Router();

router.get('/', isAuthorizedAs('ADMIN'), MidKompreCandidateController.findAll);
router.get('/:midKompreCandidateId', isAuthorizedAs('ADMIN'), MidKompreCandidateController.findOne);
router.post('/', isAuthorizedAs('ADMIN'), MidKompreCandidateController.create);
router.put('/:midKompreCandidateId', isAuthorizedAs('ADMIN'), MidKompreCandidateController.update);
router.delete('/:midKompreCandidateId', isAuthorizedAs('ADMIN'), MidKompreCandidateController.destroy);

module.exports = router;
