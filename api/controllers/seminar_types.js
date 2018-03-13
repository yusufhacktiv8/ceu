const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const departmentId = req.query.searchDepartment;

  const where = {
    $or: [
      { code: { $ilike: searchText } },
      { name: { $ilike: searchText } },
    ],
  };

  if (departmentId) {
    where.DepartmentId = departmentId;
  }

  models.SeminarType.findAll({
    where,
    include: [
      {
        model: models.Department,
      },
    ],
    order: ['code'],
  })
  .then((seminarTypes) => {
    res.json(seminarTypes);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.seminarTypesByDepartment = function (req, res) {
  const departmentId = req.query.department ? parseInt(req.query.department, 10) : -1;
  models.SeminarType.findAll({
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
  models.SeminarType.findOne({
    where: { id: req.params.seminarTypeId },
  })
  .then((seminarType) => {
    res.json(seminarType);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const seminarTypeForm = req.body;
  seminarTypeForm.DepartmentId = parseInt(seminarTypeForm.department, 10);
  models.SeminarType.create(seminarTypeForm)
  .then((seminarType) => {
    res.json(seminarType);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const seminarTypeForm = req.body;
  seminarTypeForm.DepartmentId = parseInt(seminarTypeForm.department, 10);
  models.SeminarType.update(
    seminarTypeForm,
    {
      where: { id: req.params.seminarTypeId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.SeminarType.destroy(
    {
      where: { id: req.params.seminarTypeId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
