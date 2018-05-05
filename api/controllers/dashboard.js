const Sequelize = require('sequelize');
const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.mppdCountByLevel = function mppdCountByLevel(req, res) {
  const { level } = req.query;
  models.Course.findAll({
    where: {
      status: 1,
    },
    include: [
      {
        model: models.Department,
        where: {
          level,
        },
      },
    ],
    attributes: [
      'DepartmentId',
      [Sequelize.fn('count', Sequelize.col('DepartmentId')), 'departmentCount']],
    group: ['DepartmentId', 'Department.id'],
  })
  .then((courseCounts) => {
    // res.json(result);
    const courseCountMap = {};
    for (let i = 0; i < courseCounts.length; i += 1) {
      const courseCount = courseCounts[i].dataValues;
      courseCountMap[courseCount.DepartmentId] = parseInt(courseCount.departmentCount, 10);
    }
    console.log(courseCountMap);
    models.Department.findAll({
      where: {
        level,
      },
    })
    .then((departments) => {
      const result = departments.map((department) => {
        return {
          code: department.code,
          name: department.name,
          count: courseCountMap[department.id] || 0,
        };
      });
      res.json(result);
    });
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.studentCountByLevel = function studentCountByLevel(req, res) {
  models.Student.findAll({
    attributes: [
      'level',
      [Sequelize.fn('count', Sequelize.col('id')), 'studentCount']],
    group: ['level'],
  })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.studentStatusCountByLevel = function studentStatusCountByLevel(req, res) {
  models.Student.findAll({
    attributes: [
      'status',
      [Sequelize.fn('count', Sequelize.col('id')), 'statusCount']],
    group: ['status'],
  })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
