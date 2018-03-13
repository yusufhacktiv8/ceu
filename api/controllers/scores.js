const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.scoreTypes = function findAll(req, res) {
  models.ScoreType.findAll({
    where: {},
  })
  .then((scores) => {
    res.json(scores);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const scoreForm = req.body;
  scoreForm.ScoreTypeId = parseInt(scoreForm.scoreType, 10);
  models.Score.update(
    scoreForm,
    {
      where: { id: req.params.scoreId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.Score.destroy(
    {
      where: { id: req.params.scoreId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
