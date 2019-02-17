const bcrypt = require('bcrypt');
const models = require('../../models');
const { getUserId } = require('../../helpers/AuthUtils');

const saltRounds = 10;

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

exports.changePassword = function changePassword(req, res) {
  const form = req.body;
  getUserId(req)
  .then((userId) => {
    models.User.findOne({
      where: { id: userId },
    })
    .then((user) => {
      bcrypt.compare(form.currentPassword, user.password, (err, valid) => {
        if (valid) {
          bcrypt.hash(form.newPassword, saltRounds, (err2, hash) => {
            user.password = hash;
            user.save()
            .then((saveResult) => {
              res.json(saveResult);
            });
          });
        } else {
          res.send('Wrong password', 403);
        }
      });
    })
    .catch((err) => {
      sendError(err, res);
    });
  })
  .catch(() => {
    res.send('Unauthorized', 403);
  });
};
