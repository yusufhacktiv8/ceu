const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.update = function update(req, res) {
  const kompreForm = req.body;
  kompreForm.KompreTypeId = parseInt(kompreForm.kompreType, 10);
  models.Kompre.update(
    kompreForm,
    {
      where: { id: req.params.kompreId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.Kompre.destroy(
    {
      where: { id: req.params.kompreId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
