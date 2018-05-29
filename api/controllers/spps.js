const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findOne = function findOne(req, res) {
  models.Spp.findOne({
    where: { id: req.params.sppId },
  })
  .then((spp) => {
    res.json(spp);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const sppForm = req.body;
  models.Spp.create(sppForm)
  .then((spp) => {
    res.json(spp);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const sppForm = req.body;
  models.Spp.update(
    sppForm,
    {
      where: { id: req.params.sppId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.Spp.destroy(
    {
      where: { id: req.params.sppId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
