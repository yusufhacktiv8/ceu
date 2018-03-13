const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  models.CourseProblemType.findAll({
    where: {
      $or: [
        { code: { $ilike: searchText } },
        { name: { $ilike: searchText } },
      ],
    },
  })
  .then((courseProblemTypes) => {
    res.json(courseProblemTypes);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.findOne = function findOne(req, res) {
  models.CourseProblemType.findOne({
    where: { id: req.params.courseProblemTypeId },
  })
  .then((courseProblemType) => {
    res.json(courseProblemType);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const courseProblemTypeForm = req.body;
  models.CourseProblemType.create(courseProblemTypeForm)
  .then((courseProblemType) => {
    res.json(courseProblemType);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const courseProblemTypeForm = req.body;
  models.CourseProblemType.update(
    courseProblemTypeForm,
    {
      where: { id: req.params.courseProblemTypeId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.CourseProblemType.destroy(
    {
      where: { id: req.params.courseProblemTypeId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
