const models = require('../../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findStudent = function findStudent(req, res) {
  const studentId = 1; // req.params.studentId;
  models.Student.findOne({
    where: { id: studentId },
  })
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
