/**
 * Created with JetBrains WebStorm.
 * User: Sulaiman
 * Date: 1/16/15
 * Time: 12:25 AM
 * To change this template use File | Settings | File Templates.
 */

var videoScreeningDB = require('../node_modules/mongoose');
var configFile = require('./Configuration.js');
var videoScreeningSchema = videoScreeningDB.Schema;

console.log("sulaiman");
//Admin/User/Manager Schema
var video_screening_createLogin = new videoScreeningSchema({
    firstName : String,
    lastName : String,
    userName : String,
    email : String,  //email is the username.
    password : String,
    role : Number,
    status : String,
    phoneNumber : String,
    createdBy : String,
    uuid : String,
    lastUpdatedTimeStamp : Date,
    lastUpdatedBy : String
});
video_screening_createLogin.index({first_name:1,last_name:1,email:1,userName:1});

var video_screening_userRole = new videoScreeningSchema({
    role : Number,
    roleName : String,
    lastUpdatedTimeStamp : Date,
    lastUpdatedBy : String
});

var video_screening_company = new videoScreeningSchema({
    companyName : String,
    lastUpdatedTimeStamp : Date,
    lastUpdatedBy : String
})

var video_screening_company_user_bridge_table = new videoScreeningSchema({
    companyId : String,
    userId : String,
    role : Number,
    status : String,
    createdBy : String,
    lastUpdatedTimeStamp : Date,
    lastUpdatedBy : String
});

var video_screening_interview = new videoScreeningSchema({
    interviewName : String,
    createdBy : String,        // created by is the managerId.
    status : Number,
    lastUpdatedTimeStamp : Date,
    lastUpdatedBy : String
});

var video_screening_question = new videoScreeningSchema({
    interviewId : String,
    question : String,
    status : Number,
    createdBy : String,       // created by is the managerId.
    lastUpdatedTimeStamp : Date,
    lastUpdatedBy : String
});

var video_screening_candidates = new videoScreeningSchema({
    interviewId : String,
    userId : String,
    createdBy : String,       // created by is the managerId.
    status : Number,
    isCompleted : Number,
    lastUpdatedTimeStamp : Date,
    lastUpdatedBy : String
});

var video_screening_candidates_answers = new videoScreeningSchema({
    interviewId : String,
    questionId : String,
    userId : String,
    videoAnswerId : Object,
    lastUpdatedTimeStamp : Date,
    lastUpdatedBy : String
});

videoScreeningDB.model('videoScreeningCreateLogin',video_screening_createLogin);
videoScreeningDB.model('videoScreeningCompany',video_screening_company);
videoScreeningDB.model('videoScreeningCompanyUser',video_screening_company_user_bridge_table);
videoScreeningDB.model('videoScreeningInterview',video_screening_interview);
videoScreeningDB.model('videoScreeningQuestion',video_screening_question);
videoScreeningDB.model('videoScreeningCandidates',video_screening_candidates);
videoScreeningDB.model('videoScreeningCandidatesAnswers',video_screening_candidates_answers);
videoScreeningDB.connect(configFile.dbAddress, function (err, db) {
    if (err) {
        throw err;
    } else {
        console.log("successfully connected to the database videoScreening");
    }
});