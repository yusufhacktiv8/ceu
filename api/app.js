var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var fileUpload = require('express-fileupload');

var index = require('./routes/index');
var users = require('./routes/users');
var usersByRole = require('./routes/users_by_role');
var changePassword = require('./routes/change_password');
var roles = require('./routes/roles');
var hospitalUsers = require('./routes/hospital_users');
var appProps = require('./routes/app_props');
var students = require('./routes/students');
var studentsStatus = require('./routes/students_status');
var departments = require('./routes/department');
var departmentsAll = require('./routes/department_all');
var courses = require('./routes/course');
var scores = require('./routes/scores');
var scoreTypes = require('./routes/score_types');
var courseProblems = require('./routes/course_problems');
var courseProblemTypes = require('./routes/course_problem_types');
var portofolios = require('./routes/portofolios');
var portofolioTypes = require('./routes/portofolio_types');
var portofolioTypesByDepartment = require('./routes/pft_by_department');
var sgls = require('./routes/sgls');
var sglTypes = require('./routes/sgl_types');
var sglTypesByDepartment = require('./routes/sgt_by_department');
var yudisiumChecklists = require('./routes/yudisiumchecklists');
var yudisium2Checklists = require('./routes/yudisium2checklists');
var kompres = require('./routes/kompres');
var ukmppds = require('./routes/ukmppds');
var kompreTypes = require('./routes/kompre_types');
var hospitals = require('./routes/hospital');
var hospitalDepartments = require('./routes/hospitaldepartment');
var hospitalSelect = require('./routes/hospitalselect');
var seminars = require('./routes/seminar');
var seminarFileUpload = require('./routes/seminar_fileupload');
var seminarTypes = require('./routes/seminar_types');
var seminarTypesByDepartment = require('./routes/seminar_types_by_department');
var assistances = require('./routes/assistance');
var assistanceFileUpload = require('./routes/assistance_fileupload');
var uploadScores = require('./routes/uploads/scores');
var uploadScoreFile = require('./routes/uploads/scorefile');
var uploadKompres = require('./routes/uploads/kompres');
var uploadKompreFile = require('./routes/uploads/komprefile');
var assistanceParticipants = require('./routes/assistance_participants');
var assistanceTopics = require('./routes/assistance_topics');
var assistanceTopicsByDepartment = require('./routes/assistance_topics_by_department');
var assistanceAttendance = require('./routes/assistance_attendance');
var security = require('./routes/security');
var reports = require('./routes/reports');
var bakordik = require('./routes/bakordik');
var docents = require('./routes/docents');
var docentsByHD = require('./routes/docents_by_hd');
var pengampus = require('./routes/pengampus');
var pengampusByDepartment = require('./routes/pengampus_by_department');
var tutors = require('./routes/tutors');
var tutorsForSelect = require('./routes/tutors_for_select');
var supervisors = require('./routes/supervisors');
var supervisorsForSelect = require('./routes/supervisors_for_select');
var dashboard = require('./routes/dashboard');
var spps = require('./routes/spp');
var krss = require('./routes/krs');

var midKompreCandidate = require('./routes/midkomprecandidates');
var yudisiumCandidate = require('./routes/yudisiumcandidates');
var rotations = require('./routes/rotations');

const studentUsers = require('./routes/student_users');
const studentAppCourses = require('./student_app/routes/courses');
const studentAppProfiles = require('./student_app/routes/profiles');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.use('/', index);
app.use('/api/users', users);
app.use('/api/usersbyrole', usersByRole);
app.use('/api/changepassword', changePassword);
app.use('/api/roles', roles);
app.use('/api/hospitalusers', hospitalUsers);
app.use('/api/appprops', appProps);
app.use('/api/students', students);
app.use('/api/students_status', studentsStatus);
app.use('/api/departments', departments);
app.use('/api/alldepartments', departmentsAll);
app.use('/api/courses', courses);
app.use('/api/scores', scores);
app.use('/api/scoretypes', scoreTypes);
app.use('/api/courseproblems', courseProblems);
app.use('/api/courseproblemtypes', courseProblemTypes);
app.use('/api/portofolios', portofolios);
app.use('/api/portofoliotypes', portofolioTypes);
app.use('/api/portofoliotypesbydepartment', portofolioTypesByDepartment);
app.use('/api/sgls', sgls);
app.use('/api/sgltypes', sglTypes);
app.use('/api/sgltypesbydepartment', sglTypesByDepartment);
app.use('/api/yudisiumchecklists', yudisiumChecklists);
app.use('/api/yudisium2checklists', yudisium2Checklists);
app.use('/api/kompres', kompres);
app.use('/api/kompretypes', kompreTypes);
app.use('/api/ukmppds', ukmppds);
app.use('/api/hospitals', hospitals);
app.use('/api/hospitaldepartments', hospitalDepartments);
app.use('/api/hospitalselect', hospitalSelect);
app.use('/api/seminars', seminars);
app.use('/api/seminarupload', seminarFileUpload);
app.use('/api/seminartypes', seminarTypes);
app.use('/api/seminartypesbydepartment', seminarTypesByDepartment);
app.use('/api/assistances', assistances);
app.use('/api/assistanceupload', assistanceFileUpload);
app.use('/api/assistanceparticipants', assistanceParticipants);
app.use('/api/assistancetopics', assistanceTopics);
app.use('/api/assistancetopicsbydepartment', assistanceTopicsByDepartment);
app.use('/api/assistanceattendance', assistanceAttendance);
app.use('/api/uploadscores', uploadScores);
app.use('/api/uploadscorefile', uploadScoreFile);
app.use('/api/downloadscorefile', uploadScoreFile);
app.use('/api/uploadkompres', uploadKompres);
app.use('/api/uploadkomprefile', uploadKompreFile);
app.use('/api/downloadkomprefile', uploadKompreFile);
app.use('/api/security', security);
app.use('/api/reports', reports);
app.use('/api/bakordik', bakordik);
app.use('/api/docents', docents);
app.use('/api/docentsbyhd', docentsByHD);
app.use('/api/pengampus', pengampus);
app.use('/api/pengampusbydepartment', pengampusByDepartment);
app.use('/api/tutors', tutors);
app.use('/api/tutorsforselect', tutorsForSelect);
app.use('/api/supervisors', supervisors);
app.use('/api/supervisorsforselect', supervisorsForSelect);
app.use('/api/dashboard', dashboard);
app.use('/api/spps', spps);
app.use('/api/krss', krss);
app.use('/api/midkomprecandidates', midKompreCandidate);
app.use('/api/reports/yudisiumcandidates', yudisiumCandidate);
app.use('/api/reports/rotations', rotations);

app.use('/api/studentusers', studentUsers);
app.use('/api/studentapp/courses', studentAppCourses);
app.use('/api/studentapp/profile', studentAppProfiles);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.error(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
