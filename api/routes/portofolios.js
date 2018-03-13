const express = require('express');
const PortofolioController = require('../controllers/portofolios.js');

const router = express.Router();

router.put('/:portofolioId', PortofolioController.update);
router.delete('/:portofolioId', PortofolioController.destroy);

module.exports = router;
