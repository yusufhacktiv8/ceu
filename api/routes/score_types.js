const express = require('express');
const ScoreController = require('../controllers/scores.js');

const router = express.Router();

router.get('/', ScoreController.scoreTypes);

module.exports = router;
