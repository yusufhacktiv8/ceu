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

  models.Pengampu.findAndCountAll({
    where,
    include: [
      { model: models.Department },
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

exports.pengampusByDepartment = function findAll(req, res) {
  const departmentId = req.query.department ? parseInt(req.query.department, 10) : -1;
  models.Pengampu.findAll({
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
  models.Pengampu.findOne({
    where: { id: req.params.pengampuId },
  })
  .then((pengampu) => {
    res.json(pengampu);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const pengampuForm = req.body;
  const departmentId = pengampuForm.department;

  pengampuForm.DepartmentId = departmentId;

  models.Pengampu.create(pengampuForm)
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const pengampuForm = req.body;
  const departmentId = pengampuForm.department;

  models.Pengampu.findOne({
    where: { id: req.params.pengampuId },
  })
  .then((pengampu) => {
    pengampu.code = pengampuForm.code;
    pengampu.name = pengampuForm.name;
    pengampu.DepartmentId = departmentId;

    pengampu.save()
    .then((saveResult) => {
      res.json(saveResult);
    });
  })
  .catch((err) => {
    sendError(err, res);
  });

  models.Pengampu.update(
    pengampuForm,
    {
      where: { id: req.params.pengampuId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.Pengampu.destroy(
    {
      where: { id: req.params.pengampuId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
