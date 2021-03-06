const Excel = require('exceljs');
const Readable = require('stream').Readable;
const moment = require('moment');
const models = require('../../models');
const Constant = require('../../Constant');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const searchDepartment = req.query.searchDepartment;
  const searchScoreType = req.query.searchScoreType;
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;

  const studentWhere = {
    $or: [
      { name: { $ilike: searchText } },
      { oldSid: { $ilike: searchText } },
      { newSid: { $ilike: searchText } },
    ],
  };

  const departmentWhere = {};
  if (searchDepartment) {
    departmentWhere.id = searchDepartment;
  }

  const scoreTypeWhere = {};
  if (searchScoreType) {
    scoreTypeWhere.id = searchScoreType;
  }

  models.Score.findAndCountAll({
    // where: {},
    include: [
      { model: models.Course,
        // where: { id: req.params.courseId },
        required: true,
        include: [
          {
            model: models.Student,
            required: true,
            where: studentWhere,
          },
          {
            model: models.Department,
            required: true,
            where: departmentWhere,
          },
        ],
      },
      {
        model: models.ScoreType,
        required: true,
        where: scoreTypeWhere,
      },
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

exports.upload = function upload(req, res) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "scoreFile") is used to retrieve the uploaded file
  const scoreFile = req.files.scoreFile;

  // Use the mv() method to place the file somewhere on your server
  const firstLineIndex = 2;
  const uploadTypeIndex = 'B';
  const departmentCodeIndex = 'C';
  const newSidIndex = 'D';
  const scoreDateIndex = 'F';
  const scoreValueIndex = 'G';

  const workbook = new Excel.Workbook();
  const stream = new Readable();
  stream._read = function noop() {};
  stream.push(scoreFile.data);
  stream.push(null);
  workbook.xlsx.read(stream)
      .then(() => {
        const worksheet = workbook.getWorksheet(1);
        const promises = [];

        for (let i = firstLineIndex; i <= Constant.MAX_SCORE_UPLOADED_ROW + firstLineIndex; i += 1) {
          const departmentCode = worksheet.getCell(`${departmentCodeIndex}${i}`).value;
          const uploadType = worksheet.getCell(`${uploadTypeIndex}${i}`).value;

          if (!uploadType) break;

          const newSid = String(worksheet.getCell(`${newSidIndex}${i}`).value);
          if (departmentCode === null) {
            break;
          }
          const scoreDate = moment(worksheet.getCell(`${scoreDateIndex}${i}`).value, 'DD/MM/YYYY HH:mm:ss').toDate();
          const scoreValue = parseFloat(worksheet.getCell(`${scoreValueIndex}${i}`).value);

          const promise = new Promise((resolve, reject) => {
            models.Score.findOne({
              where: {},
              include: [
                {
                  model: models.Course,
                  required: true,
                  // where: {
                  //   status: 1,
                  // },
                  include: [
                    {
                      model: models.Student,
                      required: true,
                      where: {
                        newSid,
                      },
                    },
                    {
                      model: models.Department,
                      required: true,
                      where: {
                        code: departmentCode,
                      },
                    },
                  ],
                },
                {
                  model: models.ScoreType,
                  required: true,
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
                  resolve({ newSid, found: true, action: 'updating' });
                });
              } else {
                models.Course.findOne({
                  // where: {
                  //   status: 1,
                  // },
                  include: [
                    {
                      model: models.Student,
                      required: true,
                      where: {
                        newSid,
                      },
                    },
                    {
                      model: models.Department,
                      required: true,
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
                        resolve({ newSid, found: true, action: 'create new' });
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

exports.download = function download(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const searchDepartment = req.query.searchDepartment;
  const searchScoreType = req.query.searchScoreType;

  const studentWhere = {
    $or: [
      { name: { $ilike: searchText } },
      { oldSid: { $ilike: searchText } },
      { newSid: { $ilike: searchText } },
    ],
  };

  const departmentWhere = {};
  if (searchDepartment) {
    departmentWhere.id = searchDepartment;
  }

  const scoreTypeWhere = {};
  if (searchScoreType) {
    scoreTypeWhere.id = searchScoreType;
  }

  models.Score.findAll({
    // where: {},
    include: [
      { model: models.Course,
        // where: { id: req.params.courseId },
        required: true,
        include: [
          {
            model: models.Student,
            required: true,
            where: studentWhere,
          },
          {
            model: models.Department,
            required: true,
            where: departmentWhere,
          },
        ],
      },
      {
        model: models.ScoreType,
        required: true,
        where: scoreTypeWhere,
      },
    ],
  })
  .then((scores) => {
    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet('My Sheet');
    sheet.getCell('A1').value = 'No';
    sheet.getCell('B1').value = 'Departemen';
    sheet.getCell('C1').value = 'Tipe';
    sheet.getCell('D1').value = 'Nama';
    sheet.getCell('E1').value = 'Stambuk Lama';
    sheet.getCell('F1').value = 'Stambuk Baru';
    sheet.getCell('G1').value = 'Nilai';
    sheet.getCell('H1').value = 'Tanggal';

    for (let i = 0; i < scores.length; i += 1) {
      sheet.getCell(`A${i+2}`).value = i + 1;
      sheet.getCell(`B${i+2}`).value = scores[i].Course.Department.name;
      sheet.getCell(`C${i+2}`).value = scores[i].ScoreType.code;
      sheet.getCell(`D${i+2}`).value = scores[i].Course.Student.name;
      sheet.getCell(`E${i+2}`).value = scores[i].Course.Student.oldSid;
      sheet.getCell(`F${i+2}`).value = scores[i].Course.Student.newSid;
      sheet.getCell(`G${i+2}`).value = scores[i].scoreValue;
      sheet.getCell(`H${i+2}`).value = moment(scores[i].scoreDate).format('DD/MM/YYYY')
    }

    // res.setContentType('application/vnd.ms-excel');
    res.setHeader('Content-disposition', 'attachment; filename=score.xlsx');

    workbook.xlsx.write(res)
      .then(function() {
          // done
      });
  });
};
