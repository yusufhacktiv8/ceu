const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const models = require('../models');

const sendLoginFailedMessage = function (req, res) {
  res.send('Invalid username or password', 403);
};

exports.signIn = function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  models.User.findOne({
    where: { username },
    include: [
      {
        model: models.Role,
      },
    ],
  })
  .then((user) => {
    if (user !== null) {
      bcrypt.compare(password, user.password, (err, bcryptResult) => {
        if (bcryptResult) {
          const token = jwt.sign({
            userId: user.id,
            name: user.name,
            role: user.Role.code,
          }, process.env.REACT_APP_TOKEN_PASSWORD, { expiresIn: 60 * 60 });
          res.json({
            token,
          });
        } else {
          sendLoginFailedMessage(req, res);
        }
      });
    } else {
      sendLoginFailedMessage(req, res);
    }
  });
};
