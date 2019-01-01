const models = require('../../models');

const DEFAULT_LEVEL = 1;

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  const studentId = 1; // req.params.studentId;
  const courseFilter = {
    level: DEFAULT_LEVEL,
  };
  if (req.query.level) {
    courseFilter.level = parseInt(req.query.level, 10);
  }
  models.Course.findAll({
    where: {
      StudentId: studentId,
    },
    include: [
      { model: models.Department, where: { ...courseFilter } },
    ],
    order: [
      ['planStartDate'],
    ],
  })
  .then((courses) => {
    res.json(courses);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
