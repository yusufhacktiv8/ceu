const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const studentId = req.query.searchStudent;
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;

  const where = {};

  if (studentId) {
    where.StudentId = studentId;
  }

  models.StudentUser.findAndCountAll({
    where,
    include: [
      { model: models.User,
        where: {
          $or: [
            { username: { $ilike: searchText } },
            { name: { $ilike: searchText } },
          ],
        } },
      { model: models.Student },
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
  models.StudentUser.findOne({
    where: { id: req.params.studentUserId },
  })
  .then((studentUser) => {
    res.json(studentUser);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const studentUserForm = req.body;
  const userId = studentUserForm.user;
  const studentId = studentUserForm.student;

  studentUserForm.UserId = userId;
  studentUserForm.StudentId = studentId;

  models.StudentUser.create(studentUserForm)
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const studentUserForm = req.body;
  const userId = studentUserForm.user;
  const studentId = studentUserForm.student;

  models.StudentUser.findOne({
    where: { id: req.params.studentUserId },
  })
  .then((studentUser) => {
    studentUser.UserId = userId;
    studentUser.StudentId = studentId;
    studentUser.save()
    .then((saveResult) => {
      res.json(saveResult);
    });
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.StudentUser.destroy(
    {
      where: { id: req.params.studentUserId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
