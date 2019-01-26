const models = require('../../models');

const DEFAULT_LEVEL = 1;

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

const getSglCount = courseId => (
  new Promise((resolve, reject) => {
    models.Sgl.count({
      where: {},
      include: [
        { model: models.Course, where: { id: courseId } },
        { model: models.SglType },
      ],
    })
    .then((sglCount) => {
      resolve(sglCount);
    })
    .catch((err) => {
      reject(err);
    });
  })
);

exports.findAll = function findAll(req, res) {
  const studentId = 1; // req.params.studentId;
  const courseFilter = {
    level: DEFAULT_LEVEL,
  };
  if (req.query.level) {
    courseFilter.level = parseInt(req.query.level, 10);
  }
  models.Course.findAll({
    where: {
      StudentId: studentId,
    },
    include: [
      { model: models.Department, where: { ...courseFilter } },
    ],
    order: [
      ['planStartDate'],
    ],
  })
  .then((courses) => {
    res.json(courses);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.findOne = function findOne(req, res) {
  const studentId = 1; // req.params.studentId;
  models.Course.findOne({
    where: { id: req.params.courseId },
    include: [
      {
        model: models.Student,
        where: {
          id: studentId,
        },
      },
      { model: models.Department },
      { model: models.Score },
      { model: models.Hospital, as: 'hospital1' },
      { model: models.Hospital, as: 'hospital2' },
      { model: models.Hospital, as: 'clinic' },
      { model: models.Docent, as: 'adviser' },
      { model: models.Docent, as: 'examiner' },
      { model: models.Docent, as: 'dpk' },
    ],
  })
  .then((course) => {
    getSglCount(course.id)
    .then((sglCount) => {
      const result = {
        id: course.id,
        Department: course.Department,
        title: course.title,
        status: course.status,
        sglCount,
      };
      res.json(result);
    })
    .catch((err) => {
      sendError(err, res);
    });
  });
};
