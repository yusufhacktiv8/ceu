const express = require('express');
const ReportController = require('../controllers/reports.js');
const CostUnitController = require('../controllers/cost_units.js');

const router = express.Router();

router.get('/initiatecourses', ReportController.findInitiateCourses);
router.get('/completedcourses', ReportController.findCompletedCourses);
router.get('/levelcourses', ReportController.findLevelCourses);
router.get('/assistancecourses', ReportController.findAssistanceCourses);
router.post('/initiatexpt', ReportController.initiateXpt);
router.post('/exporttopretest', ReportController.exportToPreTest);
router.post('/levelxpt', ReportController.levelXpt);
router.post('/assistancexpt', ReportController.assistanceXpt);
router.get('/pretests', ReportController.findPreTests);
router.put('/pretests/remove', ReportController.removeCoursesFormPreTest);
router.get('/costunits', CostUnitController.costUnits);
router.get('/costunitsclinic', CostUnitController.costUnitsClinic);

module.exports = router;
