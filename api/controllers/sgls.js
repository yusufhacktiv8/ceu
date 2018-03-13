const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.update = function update(req, res) {
  const sglForm = req.body;
  sglForm.SglTypeId = parseInt(sglForm.sglType, 10);
  if (sglForm.mainTutor) {
    sglForm.mainTutorId = parseInt(sglForm.mainTutor, 10);
  } else {
    sglForm.mainTutorId = null;
  }
  if (sglForm.secondTutor) {
    sglForm.secondTutorId = parseInt(sglForm.secondTutor, 10);
  } else {
    sglForm.secondTutorId = null;
  }
  if (sglForm.thirdTutor) {
    sglForm.thirdTutorId = parseInt(sglForm.thirdTutor, 10);
  } else {
    sglForm.thirdTutorId = null;
  }
  models.Sgl.update(
    sglForm,
    {
      where: { id: req.params.sglId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.Sgl.destroy(
    {
      where: { id: req.params.sglId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
