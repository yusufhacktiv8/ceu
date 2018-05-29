const moment = require('moment');
const Sequelize = require('sequelize');
const AWS = require('aws-sdk');
const shortid = require('shortid');
const _ = require('lodash');
const models = require('../models');

const WEEK_BREAK_DURATION = 2;

exports.findAll = function (req, res) {
  const level = req.query.level ? parseInt(req.query.level, 10) : 0;
  const status = req.query.status ? req.query.status : '';
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;

  const where = {
    $or: [
      { name: { $ilike: searchText } },
      { oldSid: { $ilike: searchText } },
      { newSid: { $ilike: searchText } },
    ],
  };

  where.$and = [];
  if (level !== 0) {
    where.$and.push({ level });
  }

  if (status !== '') {
    where.$and.push({ status });
  }

  models.Student.findAndCountAll({
    where,
    order: [
      ['name'],
    ],
    limit,
    offset,
  })
  .then((result) => {
    res.json(result);
  });
};

exports.findOne = function(req, res) {
  models.Student.findOne({
    where: { id: req.params.studentId }
  })
  .then((student) => {
    res.json(student);
  });
};

exports.getStatusCount = function(req, res) {
  models.Student.findAll({
    attributes: ['status', [Sequelize.fn('count', Sequelize.col('status')), 'statusCount']],
    group: ['status'],
  })
  .then((result) => {
    res.json(result);
  });
};

exports.create = function(req, res) {
  const studentForm = req.body;
  studentForm.status = 'ACTIVE';
  models.Student.create(studentForm)
  .then((result) => {
    models.YudisiumChecklist.create({
      StudentId: result.id,
    })
    .then(() => {
      res.json(result);
    });
  })
  .catch(err => res.status(500).send(err.message));
};

exports.update = function updateStudent(req, res) {
  const studentForm = req.body;
  models.Student.update(
    studentForm,
    {
      where: { id: req.params.studentId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch(err => res.status(500).send(err.message));
};

exports.delete = function deleteStudent(req, res) {
  models.YudisiumChecklist.destroy({
    where: {
      StudentId: req.params.studentId,
    },
  }).then(() => {
    models.Student.destroy(
      {
        where: { id: req.params.studentId },
      })
    .then((result) => {
      res.json(result);
    })
    .catch(err => res.status(500).send(err.message));
  });
};

const createPortofolios = (courseId, departmentId) => {
  return new Promise((resolve, reject) => {
    models.PortofolioType.findAll({
      where: {
        DepartmentId: departmentId,
        active: true,
      },
    })
    .then((portofolioTypes) => {
      const promises2 = [];
      for (let i = 0; i < portofolioTypes.length; i += 1) {
        const portofolioType = portofolioTypes[i];
        const promise2 = new Promise((resolve2, reject2) => {
          models.Portofolio.create({
            CourseId: courseId,
            PortofolioTypeId: portofolioType.id,
          })
          .then((createdPortofolio) => {
            resolve2(createdPortofolio);
          });
        });
        promises2.push(promise2);
      }
      Promise.all(promises2)
      .then((result) => {
        resolve(result);
      });
    });
  });
};

const createSgls = (courseId, departmentId) => {
  return new Promise((resolve, reject) => {
    models.SglType.findAll({
      where: {
        DepartmentId: departmentId,
        active: true,
      },
    })
    .then((sglTypes) => {
      const promises2 = [];
      for (let i = 0; i < sglTypes.length; i += 1) {
        const sglType = sglTypes[i];
        const promise2 = new Promise((resolve2, reject2) => {
          models.Sgl.create({
            CourseId: courseId,
            SglTypeId: sglType.id,
          })
          .then((createdSgl) => {
            resolve2(createdSgl);
          });
        });
        promises2.push(promise2);
      }
      Promise.all(promises2)
      .then((result) => {
        resolve(result);
      });
    });
  });
};

exports.addCourses = function(req, res) {
  const studentId = req.params.studentId;
  const form = req.body;

  if (form.formType === 'LEVEL') {
    models.Student.findOne({
      where: { id: studentId },
    })
    .then((student) => {
      models.Department.findAll({
        where: {
          level: parseInt(form.level, 10),
        },
      })
      .then((theDepartments) => {
        const promises = [];

        const createCourse = function (courseParam, studentParam, departmentParam) {
          return new Promise((resolve, reject) => {
            models.Course.create(courseParam)
            .then((course) => {
              course.setStudent(studentParam)
              .then(() => {
                course.setDepartment(departmentParam)
                .then(() => {
                  createPortofolios(course.id, departmentParam.id)
                  .then(() => {
                    createSgls(course.id, departmentParam.id)
                    .then(() => {
                      resolve(course);
                    });
                  });
                });
              });
            })
            .catch((err) => {
              reject(err);
            });
          });
        };

        const departments = _.shuffle(theDepartments);

        // let planStartDate = moment(form.formattedStartDate, 'DD/MM/YYYY');
        let planStartDate = moment(form.startDate);

        for (let i = 0; i < departments.length; i += 1) {
          const finalCourse = (i === departments.length - 1);
          const department = departments[i];

          // const planStartDate1 = planStartDate.clone();
          //
          // const planEndDate = planStartDate.clone().add(parseInt(department.duration, 10), 'weeks');
          //
          // const planEndDate1 = planStartDate1.clone().add(parseInt(department.duration1, 10), 'weeks');
          //
          // let planStartDate2 = null;
          // let planEndDate2 = null;
          // let planStartDate3 = null;
          // let planEndDate3 = null;
          //
          // if (department.duration2 && department.duration3) {
          //   planStartDate2 = planEndDate1.clone();
          //   planEndDate2 = planStartDate2.clone().add(parseInt(department.duration2, 10), 'weeks');
          //
          //   planStartDate3 = planEndDate2.clone();
          //   planEndDate3 = planStartDate3.clone().add(parseInt(department.duration3, 10), 'weeks');
          // }

          const planStartDate1 = planStartDate.clone();

          const planEndDate = planStartDate.clone().add(parseInt(department.duration, 10), 'weeks').subtract(1, 'days');

          const planEndDate1 = planStartDate1.clone().add(parseInt(department.duration1, 10), 'weeks').subtract(1, 'days');

          let planStartDate2 = null;
          let planEndDate2 = null;
          let planStartDate3 = null;
          let planEndDate3 = null;

          if (department.duration2 && department.duration3) {
            planStartDate2 = planEndDate1.clone().add(1, 'days');
            planEndDate2 = planStartDate2.clone().add(parseInt(department.duration2, 10), 'weeks').subtract(1, 'days');

            planStartDate3 = planEndDate2.clone().add(1, 'days');
            planEndDate3 = planStartDate3.clone().add(parseInt(department.duration3, 10), 'weeks').subtract(1, 'days');
          }

          const createCoursePromise = createCourse({
            title: `${department.name} ${form.suffix}`,
            planStartDate,
            planEndDate,
            planStartDate1,
            planEndDate1,
            planStartDate2,
            planEndDate2,
            planStartDate3,
            planEndDate3,
            status: 0,
            completion: 0,
            courseIndex: i + 1,
            finalCourse,
          }, student, department);

          promises.push(createCoursePromise);

          planStartDate = planEndDate.clone().add(1, 'days').add(WEEK_BREAK_DURATION, 'weeks');
        }

        Promise.all(promises)
        .then((courses) => {
          res.json(courses);
        });
      });
    });
  } else if (form.formType === 'DEPARTMENT') {
    // const planStartDate = moment(form.formattedStartDate, 'DD/MM/YYYY');
    const planStartDate = moment(form.formattedStartDate);
    const planStartDate1 = planStartDate.clone();
    models.Student.findOne({
      where: { id: studentId },
    })
    .then((student) => {
      models.Department.findOne({
        where: { id: form.department },
      })
      .then((department) => {
        const planEndDate = planStartDate.clone().add(parseInt(department.duration, 10), 'weeks');
        const planEndDate1 = planStartDate1.clone().add(parseInt(department.duration1, 10), 'weeks');

        const planStartDate2 = planEndDate1.clone();
        const planEndDate2 = planStartDate2.clone().add(parseInt(department.duration2, 10), 'weeks');

        const planStartDate3 = planEndDate2.clone();
        const planEndDate3 = planStartDate3.clone().add(parseInt(department.duration3, 10), 'weeks');

        models.Course.create({
          title: form.title,
          planStartDate,
          planEndDate,
          planStartDate1,
          planEndDate1,
          planStartDate2,
          planEndDate2,
          planStartDate3,
          planEndDate3,
          status: 0,
          completion: 0,
        })
        .then((course) => {
          course.setStudent(student)
          .then(() => {
            course.setDepartment(department)
            .then(() => {
              createPortofolios(course.id, department.id)
              .then(() => {
                createSgls(course.id, department.id)
                .then(() => {
                  res.json(course);
                });
              });
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
      });
    });
  } else {
    res.status(500).send({ error: 'Unknown add course formType' });
  }
};

exports.findCourses = function(req, res) {
  const studentId = req.params.studentId;
  const courseFilter = {};
  if (req.query.level) {
    courseFilter.level = parseInt(req.query.level, 10);
  }
  models.Student.findOne({
    where: { id: studentId },
  })
  .then((student) => {
    models.Course.findAll({
      where: {},
      include: [
        { model: models.Student, where: { id: studentId } },
        { model: models.Department, where: { ...courseFilter } },
        { model: models.Score },
        { model: models.Hospital, as: 'hospital1' },
        { model: models.Hospital, as: 'hospital2' },
        { model: models.Hospital, as: 'clinic' },
        { model: models.Docent, as: 'adviser' },
        { model: models.Docent, as: 'examiner' },
        { model: models.Docent, as: 'dpk' },
      ],
      order: [
        ['planStartDate'],
      ],
    })
    .then((courses) => {
      res.json(courses);
    });
  });
};

exports.findScores = function(req, res) {
  const studentId = req.params.studentId;
  models.Student.findOne({
    where: { id: studentId }
  })
  .then((student) => {
    models.Score.findAll({
      where: {},
      include: [
        { model: models.Student, where: { id: studentId } },
        { model: models.ScoreType },
      ],
    })
    .then((courses) => {
      res.json(courses);
    });
  });
};

exports.findSpps = function(req, res) {
  const { studentId } = req.params;
  models.Spp.findAll({
    where: {},
    include: [
      { model: models.Student, where: { id: studentId } },
    ],
  })
  .then((spps) => {
    res.json(spps);
  });
};

exports.deleteCourse = function(req, res) {
  const courseId = req.params.courseId;
  models.Course.destroy({
    where: { id: courseId },
  })
  .then((result) => {
    res.json(result);
  });
};

exports.addKompre = function(req, res) {
  const studentId = req.params.studentId;
  const kompreForm = req.body;
  kompreForm.StudentId = parseInt(studentId, 10);
  kompreForm.KompreTypeId = parseInt(kompreForm.kompreType, 10);
  models.Kompre.create(kompreForm)
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Error when doing operation.');
  });
};

exports.findKompres = function(req, res) {
  const studentId = req.params.studentId;
  models.Kompre.findAll({
    where: { StudentId: studentId },
    include: [
      { model: models.KompreType },
    ],
  })
  .then((kompres) => {
    res.json(kompres);
  });
};

exports.krsUpload = function krsUpload(req, res) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "seminarFile") is used to retrieve the uploaded file
  const krsFile = req.files.krsFile;
  const studentId = req.params.studentId;

  const base64data = new Buffer(krsFile.data, 'binary');
  const s3 = new AWS.S3();

  models.Student.findOne({
    where: { id: studentId },
  })
  .then((student) => {
    const fileId = shortid.generate();
    const fileKey = `student/krs/${fileId}.jpg`;
    s3.putObject({
      Bucket: 'ceufkumifiles',
      Key: fileKey,
      Body: base64data,
      ACL: 'public-read',
    }, () => {
      console.log('Successfully uploaded krs.');
      student.krsFileId = fileId;
      student.save()
      .then(() => {
        res.send(fileId);
      });
    });
  });
};

exports.sppUpload = function sppUpload(req, res) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "seminarFile") is used to retrieve the uploaded file
  const sppFile = req.files.sppFile;
  const studentId = req.params.studentId;

  const base64data = new Buffer(sppFile.data, 'binary');
  const s3 = new AWS.S3();

  models.Student.findOne({
    where: { id: studentId },
  })
  .then((student) => {
    const fileId = shortid.generate();
    const fileKey = `student/spp/${fileId}.jpg`;
    s3.putObject({
      Bucket: 'ceufkumifiles',
      Key: fileKey,
      Body: base64data,
      ACL: 'public-read',
    }, () => {
      console.log('Successfully uploaded spp.');
      student.sppFileId = fileId;
      student.save()
      .then(() => {
        res.send(fileId);
      });
    });
  });
};

exports.ijazahUpload = function ijazahUpload(req, res) {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "seminarFile") is used to retrieve the uploaded file
  const ijazahFile = req.files.ijazahFile;
  const studentId = req.params.studentId;

  const base64data = new Buffer(ijazahFile.data, 'binary');
  const s3 = new AWS.S3();

  models.Student.findOne({
    where: { id: studentId },
  })
  .then((student) => {
    const fileId = shortid.generate();
    const fileKey = `student/ijazah/${fileId}.jpg`;
    s3.putObject({
      Bucket: 'ceufkumifiles',
      Key: fileKey,
      Body: base64data,
      ACL: 'public-read',
    }, () => {
      console.log('Successfully uploaded ijazah.');
      student.ijazahFileId = fileId;
      student.save()
      .then(() => {
        res.send(fileId);
      });
    });
  });
};
