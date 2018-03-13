const express = require('express');
const ScoreController = require('../controllers/scores.js');

const router = express.Router();

router.put('/:scoreId', ScoreController.update);
router.delete('/:scoreId', ScoreController.destroy);

module.exports = router;
