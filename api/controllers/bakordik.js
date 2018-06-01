const jwt = require('jsonwebtoken');
const moment = require('moment');
const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

const getHospitalIdFromJwt = token => new Promise((resolve, reject) => {
  console.log('token ====> ', token);
  jwt.verify(token, process.env.TOKEN_PASSWORD, (err, decoded) => {
    console.log(decoded);
    if (decoded) {
      const { userId } = decoded;
      models.HospitalUser.findOne({
        where: { UserId: userId },
      })
        .then((hospitalUser) => {
          if (hospitalUser) {
            resolve(hospitalUser.HospitalId);
          } else {
            reject(new Error('Hospital user not found'));
          }
        })
        .catch((err2) => {
          reject(err2);
        });
    }
  });
});

exports.findInitiateStudentCourses = function findInitiateStudentCourses(req, res) {
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

  const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;
  getHospitalIdFromJwt(token)
  .then((hospitalId) => {
    const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
    const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
    const offset = (currentPage - 1) * limit;
    models.Course.count({
      distinct: true,
      where: {
        planStartDate: {
          $gte: startDate.toDate(),
          $lte: endDate.toDate(),
        },
        $or: {
          hospital1Id: hospitalId,
          hospital2Id: hospitalId,
          clinicId: hospitalId,
        },
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
    })
    .then((countResult) => {
      models.Course.findAll({
        distinct: true,
        where: {
          planStartDate: {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
          },
          $or: {
            hospital1Id: hospitalId,
            hospital2Id: hospitalId,
            clinicId: hospitalId,
          },
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
            where: {},
          },
          { model: models.Score },
          { model: models.Hospital, as: 'hospital1', where: { id: hospitalId } },
          { model: models.Hospital, as: 'hospital2' },
          { model: models.Hospital, as: 'clinic' },
          { model: models.Docent, as: 'adviser' },
          { model: models.Docent, as: 'examiner' },
          { model: models.Docent, as: 'dpk' },
        ],
        limit,
        offset,
      })
      .then((result) => {
        res.json({ rows: result, count: countResult });
      })
      .catch((err) => {
        sendError(err, res);
      });
    })
    .catch((err) => {
      sendError(err, res);
    });
  }).catch((err) => {
    sendError(err, res);
  });
};
