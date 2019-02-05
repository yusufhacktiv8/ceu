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

const getScores = courseId => (
  new Promise((resolve, reject) => {
    models.Score.findAll({
      where: {},
      include: [
        { model: models.Course, where: { id: courseId } },
        { model: models.ScoreType },
      ],
    })
    .then((scores) => {
      resolve(scores);
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
      getPortofolioCount(course.id)
      .then((portofolioCount) => {
        getSeminarCount(course.id)
        .then((seminarCount) => {
          getProblemCount(course.id)
          .then((problemCount) => {
            getScores(course.id)
            .then((scores) => {
              const result = {
                id: course.id,
                Department: course.Department,
                title: course.title,
                status: course.status,
                planStartDate: course.planStartDate,
                planStartDate1: course.planStartDate1,
                planStartDate2: course.planStartDate2,
                planStartDate3: course.planStartDate3,
                planEndDate: course.planEndDate,
                planEndDate1: course.planEndDate1,
                planEndDate2: course.planEndDate2,
                planEndDate3: course.planEndDate3,

                realStartDate: course.realStartDate,
                realStartDate1: course.realStartDate1,
                realStartDate2: course.realStartDate2,
                realStartDate3: course.realStartDate3,
                realEndDate: course.realEndDate,
                realEndDate1: course.realEndDate1,
                realEndDate2: course.realEndDate2,
                realEndDate3: course.realEndDate3,
                hospital1: course.hospital1 != null ? course.hospital1.name : null,
                hospital2: course.hospital2 != null ? course.hospital2.name : null,
                clinic: course.clinic != null ? course.clinic.name : null,
                adviser: course.adviser != null ? course.adviser.name : null,
                examiner: course.examiner != null ? course.examiner.name : null,
                dpk: course.dpk != null ? course.dpk.name : null,
                sglCount,
                portofolioCount,
                seminarCount,
                problemCount,
                scores,
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
    })
    .catch((err) => {
      sendError(err, res);
    });
  });
};

exports.findSgls = function findSgls(req, res) {
  const courseId = req.params.courseId;
  const departmentCode = req.query.department;
  models.Sgl.findAll({
    where: {},
    include: [
      { model: models.Course, where: { id: courseId } },
      { model: models.SglType,
        include: [
          { model: models.Department, where: { code: departmentCode } },
        ],
      },
    ],
  })
  .then((sgls) => {
    res.json(sgls.map(sgl => ({
      name: sgl.SglType.name,
      sglDate: sgl.sglDate,
      completed: sgl.completed,
    })));
  })
  .catch((err) => {
    sendError(err, res);
  });
};
