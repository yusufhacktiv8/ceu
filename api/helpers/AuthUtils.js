const jwt = require('jsonwebtoken');

const Constant = require('../Constant');

const isAuthorizedAsAdmin = function(req, res, next) {
  const token = req.headers.token;

  jwt.verify(token, Constant.TOKEN_PASSWORD, function(err, decoded) {
    if (decoded && decoded.role === 'ADMIN') {
      next();
    } else {
      res.send('Unauthorized', 403);
    }
  });
};

const isAuthorizedAsBakordik = function(req, res, next) {
  const token = req.headers.token;

  jwt.verify(token, Constant.TOKEN_PASSWORD, function(err, decoded) {
    if (decoded && decoded.role === 'BAKORDIK') {
      next();
    } else {
      res.send('Unauthorized', 403);
    }
  });
};

const isAuthenticated = function(req, res, next) {
  const token = req.headers.token;

  jwt.verify(token, Constant.TOKEN_PASSWORD, function(err, decoded) {
    if (decoded) {
      next();
    } else {
      res.send('Unauthorized', 403);
    }
  });
};

module.exports = {
  isAuthorizedAsAdmin,
  isAuthenticated,
};
