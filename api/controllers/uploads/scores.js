const Excel = require('exceljs');
const Readable = require('stream').Readable;
const moment = require('moment');
const models = require('../../models');
const Constant = require('../../Constant');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;
  models.Score.findAndCountAll({
    where: {},
    include: [
      { model: models.Course,
        // where: { id: req.params.courseId },
        include: [
          {
            model: models.Student,
          },
          {
            model: models.Department,
          },
        ],
      },
      { model: models.ScoreType },
    ],
    limit,
    offset,
  })
  .then((scores) => {
    res.json(scores);
  });
};

exports.create = function create(req, res) {
  const scoreForm = req.body;
  const studentId = parseInt(scoreForm.student, 10);
  const departmentId = parseInt(scoreForm.department, 10);
  const scoreTypeId = parseInt(scoreForm.scoreType, 10);

  models.Course.findOne({
    where: {
      StudentId: studentId,
      DepartmentId: departmentId,
    },
  })
  .then((course) => {
    if (course) {
      models.Score.create({
        ...scoreForm,
        CourseId: course.id,
        ScoreTypeId: scoreTypeId,
      })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error when doing operation.');
      });
    } else {
      res.status(500).send('No course found.');
    }
  });
};

exports.update = function update(req, res) {
  const scoreForm = req.body;
  scoreForm.ScoreTypeId = parseInt(scoreForm.scoreType, 10);
  models.Score.update(
    scoreForm,
    {
      where: { id: req.params.scoreId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.Score.destroy(
    {
      where: { id: req.params.scoreId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

const processUpload = (req, res, uploadType) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "scoreFile") is used to retrieve the uploaded file
  const scoreFile = req.files.scoreFile;

  // Use the mv() method to place the file somewhere on your server
  let firstLineIndex = 6;
  let newSidIndex = 'C';
  let departmentCodeIndex = 'B';
  let scoreValueIndex = 'G';

  if (uploadType === 'POSTTEST') {
    firstLineIndex = 8;
    newSidIndex = 'B';
    departmentCodeIndex = 'D';
    scoreValueIndex = 'G';
  }

  const workbook = new Excel.Workbook();
  const stream = new Readable();
  stream._read = function noop() {};
  stream.push(scoreFile.data);
  stream.push(null);
  workbook.xlsx.read(stream)
      .then(() => {
        const worksheet = workbook.getWorksheet(1);
        const promises = [];
        const scoreDate = moment().toDate();
        for (let i = firstLineIndex; i <= Constant.MAX_SCORE_UPLOADED_ROW + firstLineIndex; i += 1) {
          const departmentCode = worksheet.getCell(`${departmentCodeIndex}${i}`).value;
          const newSid = worksheet.getCell(`${newSidIndex}${i}`).value;
          if (departmentCode === null) {
            break;
          }

          const scoreValue = parseFloat(worksheet.getCell(`${scoreValueIndex}${i}`).value.result);

          const promise = new Promise((resolve, reject) => {
            models.Score.findOne({
              where: {},
              include: [
                {
                  model: models.Course,
                  where: {
                    status: 1,
                  },
                  include: [
                    {
                      model: models.Student,
                      where: {
                        newSid,
                      },
                    },
                    {
                      model: models.Department,
                      where: {
                        code: departmentCode,
                      },
                    },
                  ],
                },
                {
                  model: models.ScoreType,
                  where: {
                    code: uploadType,
                  },
                },
              ],
            }).then((foundScore) => {
              if (foundScore) {
                foundScore.scoreValue = scoreValue;
                foundScore.scoreDate = scoreDate;
                foundScore.save()
                .then(() => {
                  resolve({ newSid, found: true });
                });
              } else {
                models.Course.findOne({
                  where: {
                    status: 1,
                  },
                  include: [
                    {
                      model: models.Student,
                      where: {
                        newSid,
                      },
                    },
                    {
                      model: models.Department,
                      where: {
                        code: departmentCode,
                      },
                    },
                  ],
                })
                .then((foundCourse) => {
                  if (foundCourse) {
                    models.ScoreType.findOne({
                      where: {
                        code: uploadType,
                      },
                    })
                    .then((foundScoreType) => {
                      models.Score.create({
                        scoreValue,
                        scoreDate,
                        CourseId: foundCourse.id,
                        ScoreTypeId: foundScoreType.id,
                      })
                      .then(() => {
                        resolve({ newSid, found: true });
                      });
                    });
                  } else {
                    resolve({ newSid, found: false });
                  }
                });
              }
            })
            .catch((errFindCourse) => {
              reject(errFindCourse);
            });
          });

          promises.push(promise);
        }

        Promise.all(promises)
        .then((uploadResult) => {
          res.json(uploadResult);
        });
      })
      .catch((errReadExcel) => {
        res.status(500).send(errReadExcel.message);
      });
};

exports.preTestUpload = function (req, res) {
  processUpload(req, res, 'PRETEST');
};

exports.postTestUpload = function (req, res) {
  processUpload(req, res, 'POSTTEST');
};
