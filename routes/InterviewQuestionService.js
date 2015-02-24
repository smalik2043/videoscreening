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
        status : parseInt("1"),
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

exports.enterCandidatesForInterview = function(req,res){
    res.set('Content-Type', 'application/json');
    var interviewId = req.param("interviewId");
    var managerId = req.param("managerId");
    var candidatesObject = req.param("candidates");
    console.log(candidatesObject);
    var candidateInterviewBulk;// = mongooseDBObjects.var_video_screening_candidates.initializeUnorderedBulkOp();
    var jsonCandidateArray = []
    for(var i= 0,jsonArrayLength=candidatesObject.length;i<jsonArrayLength;i++){
        /*candidateInterviewBulk.insert({interviewId:interviewId,userId:candidatesObject[i].caID,
                                       createdBy:managerId,lastUpdatedTimeStamp : new Date(),lastUpdatedBy: managerId});*/
        jsonCandidateArray.push({interviewId:interviewId,userId:candidatesObject[i].caID,
            createdBy:managerId,status : parseInt("1"),lastUpdatedTimeStamp : new Date(),lastUpdatedBy: managerId});
    }
    //candidateInterviewBulk.execute();
    //res.status(200);
    //res.json({result:"candidates are created for an interview"})
    mongooseDBObjects.var_video_screening_candidates.collection.insert(jsonCandidateArray,function(err,result){
        if(err) throw err;
        console.log("result is: " + JSON.stringify(result));
        res.status(200);
        res.json({result:"candidates are created for an interview"})
    });

}
exports.listInterviews = function(req,res) {
    res.set('Content-Type', 'application/json');
    var userId = req.param("userId");
    var managerId = req.param("managerId");
    var jsonInterviewIDArray = [];
    var jsonInterviewArray = [];
    var jsonCreatedBy = [];
    var jsonManagersArray = [];
    var jsonQuestionArray = [];
    var mainJSONObject = {};
    var innerObject = {};
    var jsonListInterview = [];
    var questionArrayList = [];
    var usersArrayList = [];

    mongooseDBObjects.var_video_screening_candidates.find({userId : userId},function(err,screeningCandidate,count){
        if(screeningCandidate != "" && screeningCandidate != null){
            screeningCandidate.forEach(function(screeningCandidateLoop){
                jsonInterviewIDArray.push(screeningCandidateLoop.interviewId);
            });
            //console.log(jsonInterviewIDArray);
        }
        mongooseDBObjects.var_video_screening_interview.find({_id:{$in:jsonInterviewIDArray}},function(err,interview,count){
            if(interview != "" && interview != null){
                interview.forEach(function(interviewLoop){
                    jsonInterviewArray.push(interviewLoop);
                    jsonCreatedBy.push(interviewLoop.createdBy);
                });
            }
            mongooseDBObjects.var_video_screening_question.find({interviewId:{$in:jsonInterviewIDArray}},function(err,question,count){
               if(question != "" && question!= null){
                   question.forEach(function(questionLoop){
                        jsonQuestionArray.push(questionLoop);
                   });
               }
                var b = {};
                for (var i = 0; i < jsonCreatedBy.length; i++) {
                    b[jsonCreatedBy[i]] = jsonCreatedBy[i];
                }
                var c = [];
                for (var key in b) {
                    c.push(key);
                }
                mongooseDBObjects.var_video_screening_createLogin.find({_id:{$in:c}},{_id:1,firstName:1,lastName:1},function(err,managers,count){
                    if(managers !="" && managers != null){
                        managers.forEach(function(managersLoop){
                            jsonManagersArray.push(managersLoop);
                        });
                    }
                    console.log(jsonManagersArray);
                    for(var i= 0,forJSONInterviewArray=jsonInterviewArray.length;i<forJSONInterviewArray;i++){
                        innerObject['interviewId'] = jsonInterviewArray[i]._id;
                        innerObject['interviewName'] = jsonInterviewArray[i].interviewName;
                        for(var j= 0,forJSONQuestionArray = jsonQuestionArray.length;j<forJSONQuestionArray;j++){
                            if(jsonQuestionArray[j].interviewId == jsonInterviewArray[i]._id){
                                questionArrayList.push({questionId:jsonQuestionArray[j]._id,question:jsonQuestionArray[j].question});
                            }
                        }
                        //console.log(jsonCreatedBy);
                        //console.log(jsonInterviewArray);
                        for(var k= 0,forJSONManagersArray = jsonManagersArray.length;k<forJSONManagersArray;k++){
                            if(jsonInterviewArray[i].createdBy == jsonManagersArray[k]._id){
                                innerObject['Manager'] = jsonManagersArray[k].firstName +" "+ jsonManagersArray[k].lastName;
                            }
                        }
                        innerObject['questions'] = questionArrayList;
                        jsonListInterview.push(innerObject);
                        innerObject = {};
                        questionArrayList = [];
                    }
                    res.status(200);
                    res.json(jsonListInterview);
                });

            });
        });

    });
}