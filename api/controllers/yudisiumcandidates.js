const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;
  models.YudisiumCandidate.findAndCountAll({
    where: {
      // $or: [
      //   { code: { $ilike: searchText } },
      //   { name: { $ilike: searchText } },
      // ],
    },
    include: [
      {
        model: models.Student,
      },
    ],
    limit,
    offset,
  })
  .then((yudisiumCandidates) => {
    res.json(yudisiumCandidates);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.findOne = function findOne(req, res) {
  models.YudisiumCandidate.findOne({
    where: { id: req.params.yudisiumCandidateId },
  })
  .then((yudisiumCandidate) => {
    res.json(yudisiumCandidate);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const yudisiumCandidateForm = req.body;
  models.YudisiumCandidate.create(yudisiumCandidateForm)
  .then((yudisiumCandidate) => {
    res.json(yudisiumCandidate);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const yudisiumCandidateForm = req.body;
  models.YudisiumCandidate.update(
    yudisiumCandidateForm,
    {
      where: { id: req.params.yudisiumCandidateId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.YudisiumCandidate.destroy(
    {
      where: { id: req.params.yudisiumCandidateId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
