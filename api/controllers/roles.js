const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;
  models.Role.findAndCountAll({
    where: {
      $or: [
        { code: { $ilike: searchText } },
        { name: { $ilike: searchText } },
      ],
    },
    limit,
    offset,
  })
  .then((roles) => {
    res.json(roles);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.findOne = function findOne(req, res) {
  models.Role.findOne({
    where: { id: req.params.roleId },
  })
  .then((role) => {
    res.json(role);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const roleForm = req.body;
  models.Role.create(roleForm)
  .then((role) => {
    res.json(role);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const roleForm = req.body;
  models.Role.update(
    roleForm,
    {
      where: { id: req.params.roleId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.Role.destroy(
    {
      where: { id: req.params.roleId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
