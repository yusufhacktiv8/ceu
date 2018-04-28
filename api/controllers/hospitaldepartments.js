const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  const hospitalId = req.params.hospitalId;
  models.HospitalDepartment.findAll({
    where: {},
    include: [
      {
        model: models.Hospital, where: { id: hospitalId },
      },
      {
        model: models.Department,
      },
    ],
  })
  .then((hospitalDepartments) => {
    res.json(hospitalDepartments);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.findOne = function findOne(req, res) {
  models.HospitalDepartment.findOne({
    where: { id: req.params.hospitalDepartmentId },
  })
  .then((hospitalDepartment) => {
    res.json(hospitalDepartment);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const hospitalDepartmentForm = req.body;
  const hospitalId = hospitalDepartmentForm.hospital;
  const departmentId = hospitalDepartmentForm.department;
  models.HospitalDepartment.create(hospitalDepartmentForm)
  .then((createdHospitalDepartment) => {
    models.Department.findOne({
      where: {
        id: departmentId,
      },
    })
    .then((foundDepartment) => {
      createdHospitalDepartment.setDepartment(foundDepartment)
      .then(() => {
        models.Hospital.findOne({
          where: {
            id: hospitalId,
          },
        })
        .then((foundHospital) => {
          foundHospital.addHospitalDepartment(createdHospitalDepartment)
          .then((result) => {
            res.json(result);
          });
        });
      });
    });
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const hospitalDepartmentForm = req.body;
  const { department, quota } = hospitalDepartmentForm;
  models.HospitalDepartment.update(
    { DepartmentId: department, quota },
    {
      where: { id: req.params.hospitalDepartmentId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.HospitalDepartment.destroy(
    {
      where: { id: req.params.hospitalDepartmentId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
