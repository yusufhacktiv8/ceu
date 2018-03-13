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

  models.PortofolioType.findAll({
    where,
    include: [
      {
        model: models.Department,
      },
    ],
    order: ['code'],
  })
  .then((portofolioTypes) => {
    res.json(portofolioTypes);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.portofolioTypesByDepartment = function (req, res) {
  const departmentId = req.query.department ? parseInt(req.query.department, 10) : -1;
  models.PortofolioType.findAll({
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
  models.PortofolioType.findOne({
    where: { id: req.params.portofolioTypeId },
  })
  .then((portofolioType) => {
    res.json(portofolioType);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const portofolioTypeForm = req.body;
  portofolioTypeForm.DepartmentId = parseInt(portofolioTypeForm.department, 10);
  models.PortofolioType.create(portofolioTypeForm)
  .then((portofolioType) => {
    res.json(portofolioType);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const portofolioTypeForm = req.body;
  portofolioTypeForm.DepartmentId = parseInt(portofolioTypeForm.department, 10);
  models.PortofolioType.update(
    portofolioTypeForm,
    {
      where: { id: req.params.portofolioTypeId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.PortofolioType.destroy(
    {
      where: { id: req.params.portofolioTypeId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
