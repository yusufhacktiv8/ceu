const sequelize = require('sequelize');
const moment = require('moment');

const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  models.Hospital.findAll({
    where: {},
  })
  .then((hospitals) => {
    res.json(hospitals);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.findOne = function findOne(req, res) {
  models.Hospital.findOne({
    where: { id: req.params.hospitalId },
  })
  .then((hospital) => {
    res.json(hospital);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const hospitalForm = req.body;
  models.Hospital.create(hospitalForm)
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const hospitalForm = req.body;
  models.Hospital.update(
    hospitalForm,
    {
      where: { id: req.params.hospitalId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.Hospital.destroy(
    {
      where: { id: req.params.hospitalId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.findSchedule = function findSchedule(req, res) {

  const departmentId = req.query.department;
  const studentId = req.query.student;
  const startDate = moment(req.query.startDate.replace(/"/g, ''));
  const endDate = moment(req.query.endDate.replace(/"/g, ''));
  const hospitalType = parseInt(req.query.hospitalType, 10);

  models.Hospital.findAll({
    where: {
      hospitalType,
    },
    include: [
      {
        model: models.HospitalDepartment,
        include: [
          {
            model: models.Department,
          },
        ],
      },
    ],
  })
  .then((foundHospitals) => {
    const hospitals = [];
    for (let i = 0; i < foundHospitals.length; i += 1) {
      const hospital = foundHospitals[i].dataValues;

      hospital.studentsInDepartmentCount = 0;
      hospital.departmentQuota = 0;
      hospital.studentHistoryCount = 0;
      if (hospital.HospitalDepartments) {
        for (let x = 0; x < hospital.HospitalDepartments.length; x += 1) {
          if (hospital.HospitalDepartments[x].Department.id === parseInt(departmentId, 10)) {
            hospital.departmentQuota = hospital.HospitalDepartments[x].quota;
          }
        }
      }

      hospitals.push(hospital);
    }

    let groupName = 'hospital1Id';
    if (hospitalType === 2) {
      groupName = 'clinicId';
    }

    models.Course.findAll({
      where: {
        DepartmentId: departmentId,
        // planStartDate1: {
        //   $gte: startDate.toDate(),
        // },
        // planEndDate1: {
        //   $lte: endDate.toDate(),
        // },
        planStartDate1: {
          $gte: startDate.toDate(),
        },
        planEndDate1: {
          $gte: endDate.toDate(),
        },
      },
      group: [groupName],
      attributes: [groupName, [sequelize.fn('COUNT', groupName), 'hospitalCount']],
    }).then((courseGroups) => {
      // console.log(JSON.stringify(courseGroups));
      for (let i = 0; i < courseGroups.length; i += 1) {
        const courseGroup = courseGroups[i].dataValues;
        for (let j = 0; j < hospitals.length; j += 1) {
          const hospital = hospitals[j];
          if (hospital.id === parseInt(courseGroup[groupName], 10)) {
            hospital.studentsInDepartmentCount = courseGroup.hospitalCount;
          }
        }
      }
      // res.json(hospitals);

      models.Course.findAll({
        where: {
          DepartmentId: departmentId,
          StudentId: studentId,
        },
        group: [groupName],
        attributes: [groupName, [sequelize.fn('COUNT', groupName), 'hospitalCount']],
      }).then((courseGroupsStudent) => {
        // console.log(JSON.stringify(courseGroupsStudent));
        for (let i = 0; i < courseGroupsStudent.length; i += 1) {
          const courseGroupStudent = courseGroupsStudent[i].dataValues;
          for (let j = 0; j < hospitals.length; j += 1) {
            const hospital = hospitals[j];
            if (hospital.id === parseInt(courseGroupStudent[groupName], 10)) {
              hospital.studentHistoryCount = courseGroupStudent.hospitalCount;
            }
          }
        }
        res.json(hospitals);
      });
    });
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.hospitalSchedule = function hospitalSchedule(req, res) {

  const departmentId = req.query.hospitalDepartment || -1;
  const hospitalDateRange = req.query.hospitalDateRange;
  let startDate = null;
  let endDate = null;
  if (hospitalDateRange) {
    startDate = moment(hospitalDateRange[0].replace(/"/g, ''));
    endDate = moment(hospitalDateRange[1].replace(/"/g, ''));
  }
  console.log('----->>>>', startDate);
  console.log('----->>>>', endDate);
  console.log('----->>>>', departmentId);

  if (departmentId === -1) {
    models.Hospital.findAll({
      where: {},
      include: [
        {
          model: models.HospitalDepartment,
          include: [
            {
              model: models.Department,
            },
          ],
        },
      ],
    })
    .then((foundHospitals) => {
      const hospitals = [];
      for (let i = 0; i < foundHospitals.length; i += 1) {
        const hospital = foundHospitals[i].dataValues;

        hospital.studentsInDepartmentCount = 0;
        hospital.departmentQuota = 0;
        if (hospital.HospitalDepartments) {
          for (let x = 0; x < hospital.HospitalDepartments.length; x += 1) {
            hospital.departmentQuota += hospital.HospitalDepartments[x].quota;
          }
        }

        hospitals.push(hospital);
      }

      if (startDate && endDate) {
        models.Course.findAll({
          where: {
            planStartDate1: {
              $gte: startDate.toDate(),
            },
            planEndDate1: {
              $gte: endDate.toDate(),
            },
          },
          group: ['hospital1Id'],
          attributes: ['hospital1Id', [sequelize.fn('COUNT', 'hospital1Id'), 'hospitalCount']],
        }).then((courseGroups) => {
          console.log('>>>>>>>>>>>>', JSON.stringify(courseGroups));
          for (let i = 0; i < courseGroups.length; i += 1) {
            const courseGroup = courseGroups[i].dataValues;
            for (let j = 0; j < hospitals.length; j += 1) {
              const hospital = hospitals[j];

              // For hospitals
              if (hospital.id === parseInt(courseGroup.hospital1Id, 10)
              && hospital.hospitalType === 1) {
                hospital.studentsInDepartmentCount = courseGroup.hospitalCount;
              }
            }
          }

          //-------------
          models.Course.findAll({
            where: {
              planStartDate1: {
                $gte: startDate.toDate(),
              },
              planEndDate1: {
                $gte: endDate.toDate(),
              },
            },
            group: ['clinicId'],
            attributes: ['clinicId', [sequelize.fn('COUNT', 'clinicId'), 'hospitalCount']],
          }).then((courseGroupsX) => {
            console.log(JSON.stringify(courseGroupsX));
            for (let x = 0; x < courseGroupsX.length; x += 1) {
              const courseGroup2 = courseGroupsX[x].dataValues;
              for (let y = 0; y < hospitals.length; y += 1) {
                const hospitalX = hospitals[y];

                // For clinics
                if (hospitalX.id === parseInt(courseGroup2.clinicId, 10)
                && hospitalX.hospitalType === 2) {
                  hospitalX.studentsInDepartmentCount = courseGroup2.hospitalCount;
                }
              }
            }
            res.json(hospitals);
          });
          //-------------
        });
      } else {
        res.json(hospitals);
      }
    });
    return;
  }

  // =============================================================

  models.Hospital.findAll({
    where: {},
    include: [
      {
        model: models.HospitalDepartment,
        include: [
          {
            model: models.Department,
          },
        ],
      },
    ],
  })
  .then((foundHospitals) => {
    const hospitals = [];
    for (let i = 0; i < foundHospitals.length; i += 1) {
      const hospital = foundHospitals[i].dataValues;

      hospital.studentsInDepartmentCount = 0;
      hospital.departmentQuota = 0;
      hospital.studentHistoryCount = 0;
      if (hospital.HospitalDepartments) {
        for (let x = 0; x < hospital.HospitalDepartments.length; x += 1) {
          hospital.studentHistoryCount = 0;

          if (hospital.HospitalDepartments[x].Department.id === parseInt(departmentId, 10)) {
            hospital.departmentQuota = hospital.HospitalDepartments[x].quota;
            break;
          }
        }
      }

      hospitals.push(hospital);
    }

    if (startDate && endDate) {
      models.Course.findAll({
        where: {
          DepartmentId: departmentId,
          // planStartDate1: {
          //   $gte: startDate.toDate(),
          // },
          // planEndDate1: {
          //   $lte: endDate.toDate(),
          // },
          planStartDate1: {
            $gte: startDate.toDate(),
          },
          planEndDate1: {
            $gte: endDate.toDate(),
          },
        },
        group: ['hospital1Id'],
        attributes: ['hospital1Id', [sequelize.fn('COUNT', 'hospital1Id'), 'hospitalCount']],
      }).then((courseGroups) => {
        console.log('>>>>>>>>>>>>', JSON.stringify(courseGroups));
        for (let i = 0; i < courseGroups.length; i += 1) {
          const courseGroup = courseGroups[i].dataValues;
          for (let j = 0; j < hospitals.length; j += 1) {
            const hospital = hospitals[j];

            // For hospitals
            if (hospital.id === parseInt(courseGroup.hospital1Id, 10)
            && hospital.hospitalType === 1) {
              hospital.studentsInDepartmentCount = courseGroup.hospitalCount;
            }
          }
        }

        //-------------
        models.Course.findAll({
          where: {
            DepartmentId: departmentId,
            // planStartDate1: {
            //   $gte: startDate.toDate(),
            // },
            // planEndDate1: {
            //   $lte: endDate.toDate(),
            // },
            planStartDate1: {
              $gte: startDate.toDate(),
            },
            planEndDate1: {
              $gte: endDate.toDate(),
            },
          },
          group: ['clinicId'],
          attributes: ['clinicId', [sequelize.fn('COUNT', 'clinicId'), 'hospitalCount']],
        }).then((courseGroupsX) => {
          console.log(JSON.stringify(courseGroupsX));
          for (let x = 0; x < courseGroupsX.length; x += 1) {
            const courseGroup2 = courseGroupsX[x].dataValues;
            for (let y = 0; y < hospitals.length; y += 1) {
              const hospitalX = hospitals[y];

              // For clinics
              if (hospitalX.id === parseInt(courseGroup2.clinicId, 10)
              && hospitalX.hospitalType === 2) {
                hospitalX.studentsInDepartmentCount = courseGroup2.hospitalCount;
              }
            }
          }
          res.json(hospitals);
        });
        //-------------
      });
    } else {
      res.json(hospitals);
    }
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.hospitalStudents = function hospitalStudents(req, res) {
  const departmentId = req.params.departmentId || -1;
  const hospitalId = req.params.hospitalId || -1;
  const hospitalDateRange = req.query.hospitalDateRange;
  let startDate = null;
  let endDate = null;
  if (hospitalDateRange) {
    startDate = moment(hospitalDateRange[0].replace(/"/g, ''));
    endDate = moment(hospitalDateRange[1].replace(/"/g, ''));
  }
  console.log('----->>>>', startDate);
  console.log('----->>>>', endDate);

  const where = {
    $or: [
      { hospital1Id: hospitalId },
      { clinicId: hospitalId },
    ],
    planStartDate1: {
      $gte: startDate.toDate(),
    },
    planEndDate1: {
      $gte: endDate.toDate(),
    },
  };

  if (departmentId !== -1) {
    where.DepartmentId = departmentId;
  }

  if (startDate && endDate) {
    models.Course.findAll({
      where,
      include: [
        {
          model: models.Student,
        },
      ],
    }).then((courses) => {
      console.log(JSON.stringify(courses));
      const students = courses.map(course => (course.Student));
      res.json(students);
    });
  } else {
    res.json([]);
  }
};
