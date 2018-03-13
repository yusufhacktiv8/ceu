const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.update = function update(req, res) {
  const portofolioForm = req.body;
  portofolioForm.PortofolioTypeId = parseInt(portofolioForm.portofolioType, 10);
  models.Portofolio.update(
    portofolioForm,
    {
      where: { id: req.params.portofolioId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.Portofolio.destroy(
    {
      where: { id: req.params.portofolioId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
