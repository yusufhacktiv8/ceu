const AWS = require('aws-sdk');
const shortid = require('shortid');
const models = require('../models');
const { BUCKET_NAME } = require('../Constant');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findOne = function findOne(req, res) {
  models.Spp.findOne({
    where: { id: req.params.sppId },
  })
  .then((spp) => {
    res.json(spp);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const sppForm = req.body;
  models.Spp.create(sppForm)
  .then((spp) => {
    res.json(spp);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const sppForm = req.body;
  models.Spp.update(
    sppForm,
    {
      where: { id: req.params.sppId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.Spp.destroy(
    {
      where: { id: req.params.sppId },
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

  const sppFile = req.files.sppFile;
  const sppId = req.params.sppId;

  const base64data = new Buffer(sppFile.data, 'binary');
  const s3 = new AWS.S3();

  models.Spp.findOne({
    where: { id: sppId },
  })
  .then((spp) => {
    const fileId = spp.fileId ? spp.fileId : shortid.generate();
    const fileKey = `students/${spp.StudentId}/spp/${fileId}.jpg`;
    s3.putObject({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: base64data,
      ACL: 'public-read',
    }, (err) => {
      if (!err) {
        console.log('Successfully uploaded spp.');
        spp.fileId = fileId;
        spp.save()
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
  const sppId = req.params.sppId;

  const s3 = new AWS.S3();

  models.Spp.findOne({
    where: { id: sppId },
  })
  .then((spp) => {
    if (spp.fileId) {
      const fileKey = `students/${spp.StudentId}/spp/${spp.fileId}.jpg`;
      s3.deleteObject({
        Bucket: BUCKET_NAME,
        Key: fileKey,
      }, (err) => {
        if (!err) {
          console.log('Successfully delete spp.');
          spp.fileId = null;
          spp.save()
          .then(() => {
            res.send(spp.fileId);
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
