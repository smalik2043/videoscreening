/**
 * Created with JetBrains WebStorm.
 * User: Sulaiman
 * Date: 2/4/15
 * Time: 9:16 PM
 * To change this template use File | Settings | File Templates.
 */

var mongooseDBObjects = require('./MongooseDBObjects.js');

exports.createInterview = function(req,res){
    res.set('Content-Type', 'application/json');
    var interviewName = req.param("interviewName");
    var createdById = req.param("createdById");

    new mongooseDBObjects.var_video_screening_interview({
        interviewName : interviewName,
        createdBy : createdById,
        lastUpdatedTimeStamp : new Date(),
        lastUpdatedBy: 'admin'
    }).save(function(err,interview,count){
            if(err) return console.log(err);
            res.status(200);
            res.json({id:interview._id,interviewName:interview.interviewName,createdBy:interview.createdBy})
        });
}

exports.addQuestion = function(req,res){
    res.set('Content-Type', 'application/json');
    var interviewId = req.param("interviewId");
    var question = req.param("question");
    var createdById = req.param("createdById");

    new mongooseDBObjects.var_video_screening_question({
        interviewId : interviewId,
        question : question,
        status : parseInt("1"),
        createdBy : createdById,
        lastUpdatedTimeStamp : new Date(),
        lastUpdatedBy: 'admin'
    }).save(function(err,question,count){
            if(err) return console.log(err);
            res.status(200);
            res.json({id:question._id,interviewId:question.interviewId,question:question.question,createdBy:question.createdBy});
        });
}

exports.editQuestion = function(req,res){
    res.set('Content-Type', 'application/json');
    var questionId = req.param("questionId");
    var updatedQuestion = req.param("question");

    mongooseDBObjects.var_video_screening_question.findOne({_id:questionId},function(err,question,count){
        if(question != ""){
            mongooseDBObjects.var_video_screening_question.update({_id:questionId},{$set:{question:updatedQuestion}},function(err,questionUpdate,count){
               if(err) return console.log(err);
                //questionUpdate.forEach(function(questionUpdateLoop){
                    res.status(200);
                    res.json({result:"question id " + questionId + " is updated successfully."});
                //})
            });
        } else {
            res.json({result:"question not found."});
        }
    })
}

exports.deleteQuestion = function(req,res){
    res.set('Content-Type', 'application/json');
    var interviewId = req.param("interviewId");
    var questionId = req.param("questionId");

    mongooseDBObjects.var_video_screening_question.findOne({interviewId:interviewId,_id:questionId},function(err,questionFind,count){
        console.log(questionFind);
        if(questionFind != "" && questionFind != null){
            mongooseDBObjects.var_video_screening_question.update({interviewId:interviewId,_id:questionId},{$set:{status:parseInt("2")}},function(err,questionUpdate,count){
                if(err) return console.log(err);
                res.status(200);
                res.json({result:"question id " + questionId + " is deleted successfully"});
            });
        } else {
            res.status(404);
            res.json({result:"question id " + questionId + " is not found."});
        }
    });
}

exports.listQuestions = function(req,res){
    res.set('Content-Type', 'application/json');
    var interviewId = req.param("interviewId");
    var interviewName;
    var jsonQuestionsArray = [];
    var jsonQuestionsObject = {};
    mongooseDBObjects.var_video_screening_interview.findOne({_id:interviewId},function(err,interview,count){
        if(interview != "" && interview != null){
            interviewName = interview.interviewName;
        }
        mongooseDBObjects.var_video_screening_question.find({interviewId:interviewId},function(err,question,count){
            question.forEach(function(questionLoop){
                jsonQuestionsObject["interviewName"] = interviewName;
                jsonQuestionsObject["interviewId"] = questionLoop.interviewId;
                jsonQuestionsObject["question"] = questionLoop.question;
                jsonQuestionsObject["questionId"] = questionLoop._id;
                jsonQuestionsObject["createdBy"]= questionLoop.createdBy;
                jsonQuestionsArray.push(jsonQuestionsObject);
                jsonQuestionsObject = {}
            });
            res.status(200);
            res.json(jsonQuestionsArray);
        });
    });
}