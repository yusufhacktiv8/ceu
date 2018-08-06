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

  models.AssistanceTopic.findAndCountAll({
    where,
    include: [
      {
        model: models.Department,
      },
    ],
    order: ['code'],
  })
  .then((assistanceTopics) => {
    res.json(assistanceTopics);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.assistanceTopicsByDepartment = function (req, res) {
  const departmentId = req.query.department ? parseInt(req.query.department, 10) : -1;
  models.AssistanceTopic.findAll({
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
  models.AssistanceTopic.findOne({
    where: { id: req.params.assistanceTopicId },
  })
  .then((assistanceTopic) => {
    res.json(assistanceTopic);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const assistanceTopicForm = req.body;
  assistanceTopicForm.DepartmentId = parseInt(assistanceTopicForm.department, 10);
  models.AssistanceTopic.create(assistanceTopicForm)
  .then((assistanceTopic) => {
    res.json(assistanceTopic);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const assistanceTopicForm = req.body;
  assistanceTopicForm.DepartmentId = parseInt(assistanceTopicForm.department, 10);
  models.AssistanceTopic.update(
    assistanceTopicForm,
    {
      where: { id: req.params.assistanceTopicId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.AssistanceTopic.destroy(
    {
      where: { id: req.params.assistanceTopicId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
