
/**
 * Module dependencies.
 */

var express = require('express');
require( './routes/db' );
var routes = require('./routes');
var user = require('./routes/user');
var loginService = require('./routes/LoginService');
var interviewQuestionService = require('./routes/InterviewQuestionService');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: "1234567890"}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/signup',routes.signup);
app.get('/adminDashboard',routes.adminDashboard);

//Create Login//
app.post('/createLogin' , loginService.createLogin);
app.post('/addManager' , loginService.addManager);
app.post('/addUser' , loginService.addUser);
app.post('/adminLogin' , loginService.adminLogin);
app.post('/managerLogin' , loginService.managerLogin);
app.post('/userLogin' , loginService.userLogin);
app.put('/editManager',loginService.editManager);
app.put('/editUser',loginService.editUser);
app.put('/deleteManager',loginService.deleteManager);
app.put('/deleteUser',loginService.deleteUser);
app.get('/listManagers',loginService.listManagers);
app.get('/listUsers',loginService.listUsers);
app.post('/createInterview',interviewQuestionService.createInterview);
app.post('/addQuestion',interviewQuestionService.addQuestion);
app.post('/editQuestion',interviewQuestionService.editQuestion);
app.put('/deleteQuestion',interviewQuestionService.deleteQuestion);
app.get('/listQuestions',interviewQuestionService.listQuestions);
app.post('/enterCandidatesForInterview',interviewQuestionService.enterCandidatesForInterview);
app.get('/listInterviews',interviewQuestionService.listInterviews);
app.post('/webViewLogin' , loginService.webViewLogin);
app.get('/testService',loginService.testService);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
process.on('uncaughtException', function (error) {
    console.log(error.stack);
});
