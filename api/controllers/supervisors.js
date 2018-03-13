const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAndCountAll = function (req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;
  models.Supervisor.findAndCountAll({
    where: {
      $or: [
        { code: { $ilike: searchText } },
        { name: { $ilike: searchText } },
      ],
    },
    limit,
    offset,
  })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.findAll = function (req, res) {
  models.Supervisor.findAll({
    where: {},
  })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};


exports.findOne = function findOne(req, res) {
  models.Supervisor.findOne({
    where: { id: req.params.supervisorId },
  })
  .then((supervisor) => {
    res.json(supervisor);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const supervisorForm = req.body;

  models.Supervisor.create(supervisorForm)
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const supervisorForm = req.body;

  models.Supervisor.findOne({
    where: { id: req.params.supervisorId },
  })
  .then((supervisor) => {
    supervisor.code = supervisorForm.code;
    supervisor.name = supervisorForm.name;

    supervisor.save()
    .then((saveResult) => {
      res.json(saveResult);
    });
  })
  .catch((err) => {
    sendError(err, res);
  });

  models.Supervisor.update(
    supervisorForm,
    {
      where: { id: req.params.supervisorId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.Supervisor.destroy(
    {
      where: { id: req.params.supervisorId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
