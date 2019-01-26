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

const getPortofolioCount = courseId => (
  new Promise((resolve, reject) => {
    models.Portofolio.count({
      where: {},
      include: [
        { model: models.Course, where: { id: courseId } },
        { model: models.PortofolioType },
      ],
    })
    .then((portofolioCount) => {
      resolve(portofolioCount);
    })
    .catch((err) => {
      reject(err);
    });
  })
);

const getProblemCount = courseId => (
  new Promise((resolve, reject) => {
    models.CourseProblem.count({
      where: {},
      include: [
        { model: models.Course, where: { id: courseId } },
        { model: models.CourseProblemType },
      ],
    })
    .then((courseProblemCount) => {
      resolve(courseProblemCount);
    })
    .catch((err) => {
      reject(err);
    });
  })
);

const getSeminarCount = courseId => (
  new Promise((resolve, reject) => {
    models.Course.findOne({
      where: { id: courseId },
      include: [
        { model: models.Student },
      ],
    })
    .then((course) => {
      const where = {
        eventDate: {},
      };
      models.Participant.count({
        where: {},
        include: [
          { model: models.Seminar,
            where,
          },
          { model: models.Student, where: { id: course.Student.id } },
        ],
      })
      .then((participantCount) => {
        resolve(participantCount);
      }).catch((err) => {
        reject(err);
      });
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
      getPortofolioCount(course.id)
      .then((portofolioCount) => {
        getSeminarCount(course.id)
        .then((seminarCount) => {
          getProblemCount(course.id)
          .then((problemCount) => {
            const result = {
              id: course.id,
              Department: course.Department,
              title: course.title,
              status: course.status,
              sglCount,
              portofolioCount,
              seminarCount,
              problemCount,
            };
            res.json(result);
          })
          .catch((err) => {
            sendError(err, res);
          });
        })
        .catch((err) => {
          sendError(err, res);
        });
      })
      .catch((err) => {
        sendError(err, res);
      });
    })
    .catch((err) => {
      sendError(err, res);
    });
  });
};
