const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const departmentId = req.query.searchDepartment;
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;

  const where = {
    $or: [
      { code: { $ilike: searchText } },
      { name: { $ilike: searchText } },
    ],
  };

  if (departmentId) {
    where.DepartmentId = departmentId;
  }

  models.SglType.findAndCountAll({
    where,
    include: [
      {
        model: models.Department,
      },
    ],
    order: ['code'],
    limit,
    offset,
  })
  .then((sglTypes) => {
    res.json(sglTypes);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.sglTypesByDepartment = function (req, res) {
  const departmentId = req.query.department ? parseInt(req.query.department, 10) : -1;
  models.SglType.findAll({
    where: {},
    include: [
      { model: models.Department, where: { id: departmentId } },
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
  models.SglType.findOne({
    where: { id: req.params.sglTypeId },
  })
  .then((sglType) => {
    res.json(sglType);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const sglTypeForm = req.body;
  sglTypeForm.DepartmentId = parseInt(sglTypeForm.department, 10);
  models.SglType.create(sglTypeForm)
  .then((sglType) => {
    res.json(sglType);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const sglTypeForm = req.body;
  sglTypeForm.DepartmentId = parseInt(sglTypeForm.department, 10);
  models.SglType.update(
    sglTypeForm,
    {
      where: { id: req.params.sglTypeId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.SglType.destroy(
    {
      where: { id: req.params.sglTypeId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
