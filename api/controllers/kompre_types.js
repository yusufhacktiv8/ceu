const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  models.KompreType.findAll({
    where: {
      $or: [
        { code: { $ilike: searchText } },
        { name: { $ilike: searchText } },
      ],
    },
  })
  .then((kompreTypes) => {
    res.json(kompreTypes);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.findOne = function findOne(req, res) {
  models.KompreType.findOne({
    where: { id: req.params.kompreTypeId },
  })
  .then((kompreType) => {
    res.json(kompreType);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const kompreTypeForm = req.body;
  models.KompreType.create(kompreTypeForm)
  .then((kompreType) => {
    res.json(kompreType);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const kompreTypeForm = req.body;
  models.KompreType.update(
    kompreTypeForm,
    {
      where: { id: req.params.kompreTypeId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.KompreType.destroy(
    {
      where: { id: req.params.kompreTypeId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
