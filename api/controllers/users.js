const bcrypt = require('bcrypt');
const models = require('../models');

const saltRounds = 10;

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;
  models.User.findAndCountAll({
    where: {
      $or: [
        { username: { $ilike: searchText } },
        { name: { $ilike: searchText } },
      ],
    },
    include: [
      { model: models.Role },
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

exports.usersByRole = function findAll(req, res) {
  const roleCode = req.query.role;
  models.User.findAll({
    where: {},
    include: [
      { model: models.Role, where: { code: roleCode } },
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
  models.User.findOne({
    where: { id: req.params.userId },
  })
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const userForm = req.body;
  const roleId = userForm.role;

  models.Role.findOne({
    where: { id: roleId },
  })
  .then((role) => {
    bcrypt.hash(userForm.password, saltRounds, (err, hash) => {
      models.User.create({ ...userForm, password: hash })
      .then((user) => {
        user.setRole(role)
        .then((result) => {
          res.json(result);
        });
      })
      .catch((errCreate) => {
        sendError(errCreate, res);
      });
    });
  });
};

exports.update = function update(req, res) {
  const userForm = req.body;
  const roleId = userForm.role;

  models.User.findOne({
    where: { id: req.params.userId },
  })
  .then((user) => {
    models.Role.findOne({
      where: { id: roleId },
    })
    .then((role) => {
      user.setRole(role)
      .then((updateResult) => {
        user.name = userForm.name;
        user.email = userForm.email;

        user.save()
        .then((saveResult) => {
          res.json(saveResult);
        });
      });
    });
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.changePassword = function changePassword(req, res) {
  const form = req.body;

  models.User.findOne({
    where: { id: req.params.userId },
  })
  .then((user) => {
    // bcrypt.compare(form.currentPassword, user.password, (err, valid) => {
    //   if (valid) {
    //     bcrypt.hash(form.newPassword, saltRounds, (err2, hash) => {
    //       user.password = hash;
    //       user.save()
    //       .then((saveResult) => {
    //         res.json(saveResult);
    //       });
    //     });
    //   } else {
    //     res.send('Wrong password', 400);
    //   }
    // });
    bcrypt.hash(form.newPassword, saltRounds, (err2, hash) => {
      user.password = hash;
      user.save()
      .then((saveResult) => {
        res.json(saveResult);
      });
    });
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.User.destroy(
    {
      where: { id: req.params.userId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.userPhotoUpload = function userPhotoUpload(req, res) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "seminarFile") is used to retrieve the uploaded file
  const userPhotoFile = req.files.userPhotoFile;
  const userId = req.params.userId;

  const base64data = new Buffer(userPhotoFile.data, 'binary');
  const s3 = new AWS.S3();

  models.User.findOne({
    where: { id: userId },
  })
  .then((user) => {
    const fileId = user.userPhotoFileId ? user.userPhotoFileId : shortid.generate();
    const fileKey = `users/${userId}/photo/${fileId}.jpg`;
    s3.putObject({
      Bucket: 'ceufkumifiles',
      Key: fileKey,
      Body: base64data,
      ACL: 'public-read',
    }, () => {
      console.log('Successfully uploaded user photo.');
      user.userPhotoFileId = fileId;
      user.save()
      .then(() => {
        res.send(fileId);
      });
    });
  });
};
