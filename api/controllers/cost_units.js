const moment = require('moment');
const models = require('../models');

exports.costUnits = function(req, res) {
  let startDate = null;
  let endDate = null;
  const dateRange = req.query.dateRange;
  if (dateRange) {
    startDate = moment(dateRange[0].replace(/"/g, ''));
    endDate = moment(dateRange[1].replace(/"/g, ''));
  } else {
    res.json([]);
    return;
  }

  const hospitalId = req.query.hospital ? parseInt(req.query.hospital, 10) : -1;
  models.Course.findAll({
    where: {
      realEndDate: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      },
    },
    include: [
      { model: models.Student },
      { model: models.Department },
      { model: models.Hospital, as: 'hospital1', where: { id: hospitalId } },
      { model: models.Docent, as: 'adviser' },
      { model: models.Docent, as: 'examiner' },
      { model: models.Docent, as: 'dpk' },
    ],
  })
  .then((courses) => {
    const FEE_CONSTANT1 = 75000;
    const FEE_CONSTANT2 = 20000;
    const FEE_CONSTANT3 = 20000;
    const FEE_CONSTANT4 = 5000;
    const FEE_CONSTANT5 = 50000;
    const FEE_CONSTANT6 = 50000;
    const FEE_CONSTANT7 = 100000;

    const result = [];

    for (let i = 0; i < courses.length; i += 1) {
      const course = courses[i];

      let courseDuration1 = 0;
      if (course.realStartDate1 && course.realEndDate1) {
        const realStartDate1 = moment(course.realStartDate1);
        const realEndDate1 = moment(course.realEndDate1).add(1, 'days');
        courseDuration1 = realEndDate1.diff(realStartDate1, 'weeks');
      }

      let courseDuration2 = 0;
      if (course.realStartDate3 && course.realEndDate3) {
        const realStartDate3 = moment(course.realStartDate3);
        const realEndDate3 = moment(course.realEndDate3).add(1, 'days');
        courseDuration2 = realEndDate3.diff(realStartDate3, 'weeks');
      }

      const courseDuration = courseDuration1 + courseDuration2;

      const fee1 = courseDuration * FEE_CONSTANT1;
      const fee2 = courseDuration * FEE_CONSTANT2;
      const fee3 = courseDuration * FEE_CONSTANT3;
      const fee4 = courseDuration * FEE_CONSTANT4;
      const fee5 = courseDuration * FEE_CONSTANT5;
      const fee6 = courseDuration * FEE_CONSTANT6;
      const fee7 = courseDuration * FEE_CONSTANT7;
      const total = fee1 + fee2 + fee3 + fee4 + fee5 + fee6 + fee7;

      const tempCourse = {};
      tempCourse.Department = course.Department;
      tempCourse.Student = course.Student;
      tempCourse.courseDuration = courseDuration;
      tempCourse.adviser = course.adviser;
      tempCourse.examiner = course.examiner;
      tempCourse.fee1 = fee1;
      tempCourse.fee2 = fee2;
      tempCourse.fee3 = fee3;
      tempCourse.fee4 = fee4;
      tempCourse.fee5 = fee5;
      tempCourse.fee6 = fee6;
      tempCourse.fee7 = fee7;
      tempCourse.total = total;

      result.push(tempCourse);
    }
    res.json(result);
  });
};

exports.costUnitsClinic = function(req, res) {
  let startDate = null;
  let endDate = null;
  const dateRange = req.query.dateRange;
  if (dateRange) {
    startDate = moment(dateRange[0].replace(/"/g, ''));
    endDate = moment(dateRange[1].replace(/"/g, ''));
  } else {
    res.json([]);
    return;
  }

  const hospitalId = req.query.hospital ? parseInt(req.query.hospital, 10) : -1;
  models.Course.findAll({
    where: {
      realEndDate: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      },
    },
    include: [
      { model: models.Student },
      { model: models.Department },
      { model: models.Hospital, as: 'clinic', where: { id: hospitalId } },
      { model: models.Docent, as: 'dpk' },
    ],
  })
  .then((courses) => {
    const FEE_CONSTANT1 = 75000;
    const FEE_CONSTANT2 = 20000;
    const FEE_CONSTANT3 = 20000;
    const FEE_CONSTANT4 = 5000;
    const FEE_CONSTANT5 = 50000;
    const FEE_CONSTANT6 = 50000;
    const FEE_CONSTANT7 = 100000;

    const result = [];

    for (let i = 0; i < courses.length; i += 1) {
      const course = courses[i];
      let courseDuration = 0;
      if (course.realStartDate2 && course.realEndDate2) {
        const realStartDate2 = moment(course.realStartDate2);
        const realEndDate2 = moment(course.realEndDate2).add(1, 'days');
        courseDuration = realEndDate2.diff(realStartDate2, 'weeks');
      }

      const fee1 = courseDuration * FEE_CONSTANT1;
      const fee2 = courseDuration * FEE_CONSTANT2;
      const fee3 = courseDuration * FEE_CONSTANT3;
      const fee4 = courseDuration * FEE_CONSTANT4;
      const fee5 = courseDuration * FEE_CONSTANT5;
      const fee6 = courseDuration * FEE_CONSTANT6;
      const fee7 = courseDuration * FEE_CONSTANT7;
      const total = fee1 + fee2 + fee3 + fee4 + fee5 + fee6 + fee7;

      const tempCourse = {};
      tempCourse.Department = course.Department;
      tempCourse.Student = course.Student;
      tempCourse.courseDuration = courseDuration;
      tempCourse.dpk = course.dpk;
      tempCourse.fee1 = fee1;
      tempCourse.fee2 = fee2;
      tempCourse.fee3 = fee3;
      tempCourse.fee4 = fee4;
      tempCourse.fee5 = fee5;
      tempCourse.fee6 = fee6;
      tempCourse.fee7 = fee7;
      tempCourse.total = total;

      result.push(tempCourse);
    }
    res.json(result);
  });
};
