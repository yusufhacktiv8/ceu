const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  models.AppProp.findAll({
    where: {
      $or: [
        { code: { $ilike: searchText } },
        { name: { $ilike: searchText } },
      ],
    },
  })
  .then((appProps) => {
    res.json(appProps);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.findOne = function findOne(req, res) {
  models.AppProp.findOne({
    where: { id: req.params.appPropId },
  })
  .then((appProp) => {
    res.json(appProp);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const appPropForm = req.body;
  models.AppProp.create(appPropForm)
  .then((appProp) => {
    res.json(appProp);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const appPropForm = req.body;
  models.AppProp.update(
    appPropForm,
    {
      where: { id: req.params.appPropId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.AppProp.destroy(
    {
      where: { id: req.params.appPropId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
