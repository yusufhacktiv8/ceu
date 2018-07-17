const moment = require('moment');
const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findInitiateCourses = function(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const dateRange = req.query.dateRange;
  let startDate = null;
  let endDate = null;
  if (dateRange) {
    startDate = moment(dateRange[0].replace(/"/g, ''));
    endDate = moment(dateRange[1].replace(/"/g, ''));
  } else {
    res.json({
      count: 0,
      rows: [],
    });
    return;
  }
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;
  models.Course.findAndCountAll({
    where: {
      planStartDate: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      },
      status: 0,
      courseIndex: 1,
    },
    include: [
      {
        model: models.Student,
        where: {
          $or: [
            { name: { $ilike: searchText } },
            { oldSid: { $ilike: searchText } },
            { newSid: { $ilike: searchText } },
          ],
        },
      },
      {
        model: models.Department,
        where: {
          level: 1,
        },
      },
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

exports.findCompletedCourses = function(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const dateRange = req.query.dateRange;
  let startDate = null;
  let endDate = null;
  if (dateRange) {
    startDate = moment(dateRange[0].replace(/"/g, ''));
    endDate = moment(dateRange[1].replace(/"/g, ''));
  } else {
    res.json({
      count: 0,
      rows: [],
    });
    return;
  }
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;
  models.Course.findAndCountAll({
    where: {
      realEndDate: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      },
      status: 2,
      finalCourse: false,
    },
    include: [
      {
        model: models.Student,
        where: {
          $or: [
            { name: { $ilike: searchText } },
            { oldSid: { $ilike: searchText } },
            { newSid: { $ilike: searchText } },
          ],
        },
      },
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

exports.findLevelCourses = function(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const dateRange = req.query.dateRange;
  let startDate = null;
  let endDate = null;
  if (dateRange) {
    startDate = moment(dateRange[0].replace(/"/g, ''));
    endDate = moment(dateRange[1].replace(/"/g, ''));
  } else {
    res.json({
      count: 0,
      rows: [],
    });
    return;
  }
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;
  models.Course.findAndCountAll({
    where: {
      realEndDate: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      },
      status: 2,
      finalCourse: true,
      yudisium1Candidate: false,
    },
    include: [
      {
        model: models.Student,
        where: {
          $or: [
            { name: { $ilike: searchText } },
            { oldSid: { $ilike: searchText } },
            { newSid: { $ilike: searchText } },
          ],
          yudisiumCheck: true,
        },
      },
      {
        model: models.Department,
        where: {
          level: 1,
        },
      },
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

exports.findAssistanceCourses = function(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const dateRange = req.query.dateRange;
  let startDate = null;
  let endDate = null;
  if (dateRange) {
    startDate = moment(dateRange[0].replace(/"/g, ''));
    endDate = moment(dateRange[1].replace(/"/g, ''));
  } else {
    res.json({
      count: 0,
      rows: [],
    });
    return;
  }
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;
  models.Course.findAndCountAll({
    where: {
      realEndDate: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      },
      status: 2,
      finalCourse: true,
    },
    include: [
      {
        model: models.Student,
        where: {
          $or: [
            { name: { $ilike: searchText } },
            { oldSid: { $ilike: searchText } },
            { newSid: { $ilike: searchText } },
          ],
          yudisiumCheck: true,
        },
      },
      {
        model: models.Department,
        where: {
          level: 2,
        },
      },
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

exports.initiateXpt = function(req, res) {
  const exportToPreTestForm = req.body;
  const preTestDate = exportToPreTestForm.preTestDate;
  const courseIds = exportToPreTestForm.courseIds;
  const promises = [];
  for (let i = 0; i < courseIds.length; i += 1) {
    const courseId = courseIds[i];
    const promise = new Promise((resolve, reject) => {
      models.Course.findOne({
        where: { id: courseId },
        include: [
          { model: models.Student },
        ],
      })
      .then((foundCourse) => {
        foundCourse.preTestDate = preTestDate;
        foundCourse.save()
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
      });
    });

    promises.push(promise);
  }

  Promise.all(promises)
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.exportToPreTest = function(req, res) {
  const exportToPreTestForm = req.body;
  const preTestDate = exportToPreTestForm.preTestDate;
  const courseIds = exportToPreTestForm.courseIds;
  const promises = [];
  for (let i = 0; i < courseIds.length; i += 1) {
    const courseId = courseIds[i];
    const promise = new Promise((resolve, reject) => {
      models.Course.findOne({
        where: { id: courseId },
        include: [
          { model: models.Student },
        ],
      })
      .then((foundCourse) => {
        models.Course.update(
          { preTestDate },
          {
            where: {
              StudentId: foundCourse.Student.id,
              courseIndex: foundCourse.courseIndex + 1,
            },
          })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
      });
    });

    promises.push(promise);
  }

  Promise.all(promises)
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.levelXpt = function(req, res) {
  const form = req.body;
  const yudisiumDate = form.yudisiumDate;
  const courseIds = form.courseIds;
  const promises = [];
  for (let i = 0; i < courseIds.length; i += 1) {
    const courseId = courseIds[i];
    const promise = new Promise((resolve, reject) => {
      models.Course.findOne({
        where: { id: courseId, yudisium1Candidate: false },
        include: [
          { model: models.Student },
        ],
      })
      .then((foundCourse) => {
        foundCourse.yudisium1Candidate = true;
        foundCourse.save()
        .then((result) => {
          models.YudisiumCandidate.create({
            StudentId: foundCourse.StudentId,
            yudisiumDate,
            completed: false,
          }).then(() => {
            resolve(result);
          });
        })
        .catch((err) => {
          reject(err);
        });
      });
    });

    promises.push(promise);
  }

  Promise.all(promises)
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.assistanceXpt = function(req, res) {
  const exportToPreTestForm = req.body;
  const preTestDate = exportToPreTestForm.preTestDate;
  const courseIds = exportToPreTestForm.courseIds;
  const promises = [];
  for (let i = 0; i < courseIds.length; i += 1) {
    const courseId = courseIds[i];
    const promise = new Promise((resolve, reject) => {
      models.Course.findOne({
        where: { id: courseId },
        include: [
          { model: models.Student },
        ],
      })
      .then((foundCourse) => {
        foundCourse.preTestDate = preTestDate;
        foundCourse.save()
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
      });
    });

    promises.push(promise);
  }

  Promise.all(promises)
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.findPreTests = function(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const dateSelect = req.query.dateSelect;
  let preTestDate = null;
  if (dateSelect) {
    preTestDate = moment(dateSelect.replace(/"/g, ''));
  } else {
    res.json({
      count: 0,
      rows: [],
    });
    return;
  }
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;
  models.Course.findAndCountAll({
    where: {
      // preTestDate: preTestDate.toDate(),
      preTestDate: {
        $gte: preTestDate.toDate(),
        $lte: preTestDate.toDate(),
      },
      status: 0,
    },
    include: [
      {
        model: models.Student,
        where: {
          $or: [
            { name: { $ilike: searchText } },
            { oldSid: { $ilike: searchText } },
            { newSid: { $ilike: searchText } },
          ],
        },
      },
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

exports.removeCoursesFormPreTest = function(req, res) {
  const form = req.body;
  const courseIds = form.courseIds;
  const promises = [];
  for (let i = 0; i < courseIds.length; i += 1) {
    const courseId = courseIds[i];
    const promise = new Promise((resolve, reject) => {
      models.Course.update(
        { preTestDate: null },
        {
          where: { id: courseId },
        })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
    });

    promises.push(promise);
  }

  Promise.all(promises)
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
