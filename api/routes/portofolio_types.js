const express = require('express');
const PortofolioTypeController = require('../controllers/portofolio_types.js');

const router = express.Router();

router.get('/', PortofolioTypeController.findAll);
router.get('/:portofolioTypeId', PortofolioTypeController.findOne);
router.post('/', PortofolioTypeController.create);
router.put('/:portofolioTypeId', PortofolioTypeController.update);
router.delete('/:portofolioTypeId', PortofolioTypeController.destroy);

module.exports = router;
