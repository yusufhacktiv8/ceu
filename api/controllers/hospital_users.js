const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const hospitalId = req.query.searchHospital;
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;

  const where = {};

  if (hospitalId) {
    where.HospitalId = hospitalId;
  }

  models.HospitalUser.findAndCountAll({
    where,
    include: [
      { model: models.User,
        where: {
          $or: [
            { username: { $ilike: searchText } },
            { name: { $ilike: searchText } },
          ],
        } },
      { model: models.Hospital },
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

exports.findOne = function findOne(req, res) {
  models.HospitalUser.findOne({
    where: { id: req.params.hospitalUserId },
  })
  .then((hospitalUser) => {
    res.json(hospitalUser);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const hospitalUserForm = req.body;
  const userId = hospitalUserForm.user;
  const hospitalId = hospitalUserForm.hospital;

  hospitalUserForm.UserId = userId;
  hospitalUserForm.HospitalId = hospitalId;

  models.HospitalUser.create(hospitalUserForm)
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const hospitalUserForm = req.body;
  const userId = hospitalUserForm.user;
  const hospitalId = hospitalUserForm.hospital;

  models.HospitalUser.findOne({
    where: { id: req.params.hospitalUserId },
  })
  .then((hospitalUser) => {
    hospitalUser.UserId = userId;
    hospitalUser.HospitalId = hospitalId;
    hospitalUser.save()
    .then((saveResult) => {
      res.json(saveResult);
    });
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.HospitalUser.destroy(
    {
      where: { id: req.params.hospitalUserId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
