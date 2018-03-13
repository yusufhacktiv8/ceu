const generatePassword = require('password-generator');
const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;
  models.User.findAndCountAll({
    where: {
      $or: [
        { username: { $ilike: searchText } },
        { name: { $ilike: searchText } },
      ],
    },
    include: [
      { model: models.Role },
    ],
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

exports.usersByRole = function findAll(req, res) {
  const roleCode = req.query.role;
  models.User.findAll({
    where: {},
    include: [
      { model: models.Role, where: { code: roleCode } },
    ],
  })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.findOne = function findOne(req, res) {
  models.User.findOne({
    where: { id: req.params.userId },
  })
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const userForm = req.body;
  const roleId = userForm.role;

  models.Role.findOne({
    where: { id: roleId },
  })
  .then((role) => {
    userForm.password = generatePassword();
    models.User.create(userForm)
    .then((user) => {
      user.setRole(role)
      .then((result) => {
        res.json(result);
      });
    })
    .catch((err) => {
      sendError(err, res);
    });
  });
};

exports.update = function update(req, res) {
  const userForm = req.body;
  const roleId = userForm.role;

  models.User.findOne({
    where: { id: req.params.userId },
  })
  .then((user) => {
    models.Role.findOne({
      where: { id: roleId },
    })
    .then((role) => {
      user.setRole(role)
      .then((updateResult) => {
        user.username = userForm.username;
        user.password = userForm.password;
        user.name = userForm.name;

        user.save()
        .then((saveResult) => {
          res.json(saveResult);
        });
      });
    });
  })
  .catch((err) => {
    sendError(err, res);
  });

  models.User.update(
    userForm,
    {
      where: { id: req.params.userId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.User.destroy(
    {
      where: { id: req.params.userId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
