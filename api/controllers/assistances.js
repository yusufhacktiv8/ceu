const Excel = require('exceljs');
const models = require('../models');
const moment = require('moment');
const Readable = require('stream').Readable;
const sequelize = require('sequelize');
const Constant = require('../Constant');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const dateRange = req.query.dateRange;
  let startDate = null;
  let endDate = null;
  if (dateRange) {
    startDate = moment(dateRange[0].replace(/"/g, ''));
    endDate = moment(dateRange[1].replace(/"/g, ''));
  } else {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);

    startDate = moment(firstDay);
    endDate = moment(lastDay);
  }
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;
  models.Assistance.findAndCountAll({
    where: {
      $or: [
        { code: { $ilike: searchText } },
        { name: { $ilike: searchText } },
      ],
      eventDate: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      },
    },
    include: [
      {
        model: models.AssistanceTopic,
        include: [
          { model: models.Department },
        ],
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

exports.findAllParticipants = function findAllParticipants(req, res) {
  const assistanceId = req.params.assistanceId;
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;
  models.AssistanceParticipant.findAndCountAll({
    where: {
      AssistanceId: parseInt(assistanceId, 10),
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

exports.findOne = function findOne(req, res) {
  models.Assistance.findOne({
    where: { id: req.params.assistanceId },
  })
  .then((assistance) => {
    res.json(assistance);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const assistanceForm = req.body;
  assistanceForm.eventTime = moment(assistanceForm.eventTime, moment.HTML5_FMT.TIME_SECONDS).toDate();

  if (assistanceForm.assistanceTopic) {
    assistanceForm.AssistanceTopicId = parseInt(assistanceForm.assistanceTopic, 10);
  }

  if (assistanceForm.mainTutor) {
    assistanceForm.mainTutorId = parseInt(assistanceForm.mainTutor, 10);
  }
  if (assistanceForm.secondTutor) {
    assistanceForm.secondTutorId = parseInt(assistanceForm.secondTutor, 10);
  }
  if (assistanceForm.thirdTutor) {
    assistanceForm.thirdTutorId = parseInt(assistanceForm.thirdTutor, 10);
  }
  if (assistanceForm.facilitator) {
    assistanceForm.facilitatorId = parseInt(assistanceForm.facilitator, 10);
  }
  models.Assistance.create(assistanceForm)
  .then((assistance) => {
    res.json(assistance);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const assistanceForm = req.body;
  assistanceForm.eventTime = moment(assistanceForm.eventTime, moment.HTML5_FMT.TIME_SECONDS).toDate();

  if (assistanceForm.assistanceTopic) {
    assistanceForm.AssistanceTopicId = parseInt(assistanceForm.assistanceTopic, 10);
  }

  if (assistanceForm.mainTutor) {
    assistanceForm.mainTutorId = parseInt(assistanceForm.mainTutor, 10);
  } else {
    assistanceForm.mainTutorId = null;
  }
  if (assistanceForm.secondTutor) {
    assistanceForm.secondTutorId = parseInt(assistanceForm.secondTutor, 10);
  } else {
    assistanceForm.secondTutorId = null;
  }
  if (assistanceForm.thirdTutor) {
    assistanceForm.thirdTutorId = parseInt(assistanceForm.thirdTutor, 10);
  } else {
    assistanceForm.thirdTutorId = null;
  }
  if (assistanceForm.facilitator) {
    assistanceForm.facilitatorId = parseInt(assistanceForm.facilitator, 10);
  } else {
    assistanceForm.facilitatorId = null;
  }
  models.Assistance.update(
    assistanceForm,
    {
      where: { id: req.params.assistanceId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.Assistance.destroy(
    {
      where: { id: req.params.assistanceId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.findAssistanceParticipantsByStudent = (req, res) => {
  const studentId = req.params.studentId;
  models.AssistanceParticipant.findAll({
    where: {
      StudentId: studentId,
    },
    include: [
      {
        model: models.Assistance,
      },
    ],
    limit: 500,
    offset: 0,
  })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.fileUpload = (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "assistanceFile") is used to retrieve the uploaded file
  const assistanceFile = req.files.assistanceFile;
  const assistanceId = req.params.assistanceId;

  const workbook = new Excel.Workbook();
  const stream = new Readable();
  stream._read = function noop() {};
  stream.push(assistanceFile.data);
  stream.push(null);

  models.Assistance.findOne({
    where: { id: assistanceId },
  })
  .then((assistance) => {
    const minimumDuration = assistance.duration * 0.8;
    workbook.xlsx.read(stream)
        .then(() => {
          models.AssistanceParticipant.destroy(
            {
              where: { AssistanceId: assistanceId },
            })
          .then(() => {
            const worksheet = workbook.getWorksheet(1);
            const promises = [];
            const participants = {};

            for (let i = 2; i <= Constant.MAX_ASSISTANCE_UPLOADED_ROW; i += 1) {
              const cellA = worksheet.getCell(`B${i}`).value;
              if (cellA === null) {
                break;
              } else {
                const newSid = cellA; // .replace(/\s/, '');
                const assistanceTime = worksheet.getCell(`D${i}`).value;
                const participant = participants[newSid];
                const assistanceTimeMoment = moment(assistanceTime, 'DD/MM/YYYY HH:mm:ss');
                if (participant) {
                  participant.rows.push(assistanceTimeMoment);
                } else {
                  participants[newSid] = {
                    rows: [assistanceTimeMoment],
                  };
                }
              }
            }

            const filteredParticipants = [];
            const particpantKeys = Object.keys(participants);
            for (let i = 0; i < particpantKeys.length; i += 1) {
              const participant = participants[particpantKeys[i]];
              const firstAssistanceTime = participant.rows[0];
              const lastAssistanceTime = participant.rows[participant.rows.length - 1];
              const delta = lastAssistanceTime.diff(firstAssistanceTime, 'minutes');
              if (delta >= minimumDuration) {
                filteredParticipants.push({
                  newSid: particpantKeys[i],
                });
              }
            }

            for (let i = 0; i < filteredParticipants.length; i += 1) {
              const filteredParticipant = filteredParticipants[i];
              const promise = new Promise((resolve, reject) => {
                models.Student.findOne({
                  where: { newSid: filteredParticipant.newSid },
                })
                .then((student) => {
                  if (student) {
                    models.AssistanceParticipant.create({
                      StudentId: student.id,
                      AssistanceId: assistanceId,
                    })
                    .then(() => {
                      resolve();
                    });
                  } else {
                    resolve();
                  }
                })
                .catch((createParticipantErr) => {
                  reject(createParticipantErr);
                });
              });
              promises.push(promise);
            }

            Promise.all(promises)
            .then(() => (
              res.send(`${filteredParticipants.length} created`)
            ));
          });
        });
  });
};

exports.attendance = function findAll(req, res) {

  let batch = 0;
  let year = 0;
  models.AssistanceParticipant.findAll({
    where: { StudentId: req.params.studentId },
    include: [
      { model: models.Assistance },
    ],
  })
  .then((assistanceParticipants) => {
    if (assistanceParticipants && assistanceParticipants.length > 0) {
      batch = assistanceParticipants[0].batch;
    }
    models.Assistance.findAll({
      where: sequelize.where(sequelize.literal('EXTRACT(YEAR FROM "eventDate")'), 2018),
    })
    .then((assistances) => {
      res.json({
        attendances: assistanceParticipants,
        assistances,
      });
    });
  })
  .catch((err) => {
    sendError(err, res);
  });
};
