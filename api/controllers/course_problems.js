const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.update = function update(req, res) {
  const courseProblemForm = req.body;
  courseProblemForm.CourseProblemTypeId = parseInt(courseProblemForm.courseProblemType, 10);
  models.CourseProblem.update(
    courseProblemForm,
    {
      where: { id: req.params.courseProblemId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.CourseProblem.destroy(
    {
      where: { id: req.params.courseProblemId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
