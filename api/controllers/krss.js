const AWS = require('aws-sdk');
const shortid = require('shortid');
const models = require('../models');
const { BUCKET_NAME } = require('../Constant');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findOne = function findOne(req, res) {
  models.Krs.findOne({
    where: { id: req.params.krsId },
  })
  .then((krs) => {
    res.json(krs);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const krsForm = req.body;
  models.Krs.create(krsForm)
  .then((krs) => {
    res.json(krs);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const krsForm = req.body;
  models.Krs.update(
    krsForm,
    {
      where: { id: req.params.krsId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.Krs.destroy(
    {
      where: { id: req.params.krsId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.upload = function upload(req, res) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  const krsFile = req.files.krsFile;
  const krsId = req.params.krsId;

  const base64data = new Buffer(krsFile.data, 'binary');
  const s3 = new AWS.S3();

  models.Krs.findOne({
    where: { id: krsId },
  })
  .then((krs) => {
    const fileId = krs.fileId ? krs.fileId : shortid.generate();
    const fileKey = `students/${krs.StudentId}/krs/${fileId}.jpg`;
    s3.putObject({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: base64data,
      ACL: 'public-read',
    }, (err) => {
      if (!err) {
        console.log('Successfully uploaded krs.');
        krs.fileId = fileId;
        krs.save()
        .then(() => {
          res.send(fileId);
        });
      } else {
        sendError(err, res);
      }
    });
  });
};

exports.deleteFile = function deleteFile(req, res) {
  const krsId = req.params.krsId;

  const s3 = new AWS.S3();

  models.Krs.findOne({
    where: { id: krsId },
  })
  .then((krs) => {
    if (krs.fileId) {
      const fileKey = `students/${krs.StudentId}/krs/${krs.fileId}.jpg`;
      s3.deleteObject({
        Bucket: BUCKET_NAME,
        Key: fileKey,
      }, (err) => {
        if (!err) {
          console.log('Successfully delete krs.');
          krs.fileId = null;
          krs.save()
          .then(() => {
            res.send(krs.fileId);
          });
        } else {
          sendError(err, res);
        }
      });
    } else {
      sendError(new Error('No file found'), res);
    }
  });
};
