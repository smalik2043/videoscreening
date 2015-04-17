/**
 * Created with JetBrains WebStorm.
 * User: Sulaiman
 * Date: 2/4/15
 * Time: 9:16 PM
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');
var multiparty = require('multiparty');
var mongooseDBObjects = require('./MongooseDBObjects.js');
//var Db = require('../node_modules/mongodb').Db,
//    MongoClient = require('../node_modules/mongodb').MongoClient,
//    Server = require('../node_modules/mongodb').Server,
//    ReplSetServers = require('../node_modules/mongodb').ReplSetServers,
//    ObjectID = require('../node_modules/mongodb').ObjectID,
//    Binary = require('../node_modules/mongodb').Binary,
//    GridStore = require('../node_modules/mongodb').GridStore,
//    //Grid = require('../node_modules/mongodb').Grid,
//    Grid = require('../node_modules/gridfs-stream'),
//    Code = require('../node_modules/mongodb').Code,
//    BSON = require('../node_modules/mongodb').pure().BSON,
//    assert = require('assert');
//    fs = require('fs');
var mongo = require('../node_modules/mongodb');
ObjectID = require('../node_modules/mongodb').ObjectID;
var Grid = require('../node_modules/gridfs-stream');
var streamifier = require('../node_modules/streamifier');

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

exports.interviewsCreatedByManager = function(req,res) {
    res.set('Content-Type', 'application/json');
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
    console.log("managerId: " + managerId);
    mongooseDBObjects.var_video_screening_interview.find({createdBy:managerId},function(err,interview,count){
        if(interview != "" && interview != null){
            interview.forEach(function(interviewLoop){
                jsonInterviewArray.push(interviewLoop);
                jsonCreatedBy.push(interviewLoop.createdBy);
                for(var i=0;i<jsonInterviewArray.length;i++){
                    jsonInterviewIDArray.push(jsonInterviewArray[i]._id);
                }
                console.log(jsonInterviewIDArray)
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
                            innerObject['ManagerId'] = managerId;
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
}

//exports.fileUpload = function(req,res){
//    var form = new multiparty.Form();
//    form.parse(req,function(err,fields,files){
//        console.log(fields);
//        var video = files.thumbnail[0];
//        console.log(fs.readFileSync(video.path));
//        fs.readFile(video.path,function(err,data){
//            console.log(data);
//            var path = "E:/temp/"+video.originalFilename;
//            fs.writeFile(path,data,function(err){
//               res.send('Upload Success');
//            });
//        });
//    });
//    form.on('error',function(err){
//        console.log('Error parsing form: ' + err.stack);
//    });
//
//    //console.log(req.body);
//    //console.log(req.files);
//}
////../node_modules/gridfs-stream
//exports.saveAnswerVideo = function(req,res){
//    var fileId = new ObjectID();
//    console.log("Object Id: " + fileId);
//    var db = new mongo.Db('videoScreeningDB',new mongo.Server('localhost',27017));
//    var form = new multiparty.Form();
//    form.parse(req,function(err,fields,files){
//        var interviewId = fields.interviewId;
//        var questionId = fields.questionId;
//        var userId = fields.userId;
//        //var video_byte_string = req.param('videoAnswer');
//        console.log("interviewId " + interviewId);
//        console.log(fields);
//        var video = files.thumbnail[0];
//        fs.readFile(video.path,function(err,data){
//            console.log(data);
//            console.log(data.length);
//            var fileName = video.originalFilename;
//            var path = "E:/temp/"+video.originalFilename;
//            db.open(function(err){
//                if(err)
//                    throw err;
//                var gfs = Grid(db,mongo);
//                var writeStream = gfs.createWriteStream({mode:'w',content_type: 'video/x-ms-wmv'});
//                //var imageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAFpg2qXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MERENjc3QTVBNzlCMTFFNDlBM0JEN0VDQUUyNEIzODgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MERENjc3QTZBNzlCMTFFNDlBM0JEN0VDQUUyNEIzODgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowREQ2NzdBM0E3OUIxMUU0OUEzQkQ3RUNBRTI0QjM4OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowREQ2NzdBNEE3OUIxMUU0OUEzQkQ3RUNBRTI0QjM4OCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pikq+moAAASaSURBVHjaYvz//z8DEGQwoIIZDECJjP+oACT2nwVJFSOUBhvBBOVIoxkFl3gGVfkfppMRatxvdB0AAQSSMAXSxshijP+hbkUWZEJzTRfIfGSVjOiuYERyBVwQ2dz/AAEE8qb2fyIByARbBvyAEeYOZNfyoUkyIrmNAV3xZyh9GsWdSIAF2atobAw+QAAx4oh0dPAGiNewoFuFDzARkOeAOqWQGMWKUNoC5kEGPJ76j80ZjDhCoxWI/wBxDjHOcIXazoyueD6ataDUaoZsG7Kbk4DYDk2DF3oMIgMVHM75hayYmIjZCxBAsOgG5T9JBuoBVVBgZFJgqAVa0t8JFb/NREqawwIuoPF3EJs+YSAZyVXyQHwDKv4DqfAA4X5cBi8A4lVIfE+oYfOQxB4BsSZU/AdU7DUQr0DxAVo5DOJ7ofHxYXS9ecgFFzrYhsR+hyd4hIB4OpQ9GV2SBU8pCAozQaTIfQvEd4DYHE1tMBCvI6VwgUWWOjS2haCG/gTiUiT5dVg1A4MDZOMaKH8jliRECqhHjjwQ1vlPPbALZCZAADEiVYUhQCxKYYY5C6tbWKAlz20qlhPPgVgKW+1NDaDDRIHm31jqXxiwo8Tgi3jk/jMx0AhQYrAmpQaDSjNlpHCMgopzoxWZ/0kxeD60/L2HJLYcS4WO18WghL0SiJ9A+X+h1TEuYILEXgt1BANyloaBCGj2fgPlTyGiPIYBSTR+BhOWIlQYKQcRC9yIiby/UDqGBIPPEGNwE5TWgEYcLvAQiX2VFINB4AEQO2JRsx+I5aDsraSkYyck9j5oGj0FxC+hbAckeR9SDAa5yApNDNSxEUPiv8CXnvFlkONQjQVA/A3NB/qEmmXItfRPHGomQjEpgBHZYFALqJGCQskMif0KVIPsATKcqVxqsoLC2AWId1PRUF1QDwMgwJDzvQ606h5sYBfUbQywZgULtAVF7WCmNtgLxB7oLTd6gltAPBParYIl+n9AzAVyGLQNiw5CWNAyP73AJWiZgAvMAeI8LNldjNKuGLngD3S0gNgyjPatKyLALyLam0T5ghIA6lM9hvarQPW8KhDLYEl2RkB8FIg7oA0M5ME8kJsCgbgEewsWc2iQVLAQiCWIaC4JQJtVlIAMSpLETSDmB+J4aE1NCHyADiuxQJsQVG3IB6H1VQ5haaKBWl6fyLDzL7THvAdLACDbmUqKg7nR0psdmvxaKqT3lWh80BCAOxKfi5pdJRUqOFiTwFAm2V2wy1jSHGgkK5ECx4Kau/loYveB+DA1HPwb6sC/aOKgUbKDQMxGomNBozubYUO1SACUeb9Sq/d8Bdq1eYsmbgdtScPGBUEhp4QkLwdNl61I44iBaGZ8hyaPw8Q4hJSK4ykQiwBxLDR00fUWQDEpIA/b6B+1xycWg1ro0M5MDxB/JEHvT+gwpRI0g00m1XJcIfyPCL0voCOPpUhiEtDhTxloYDyFjrO+INJMgm5gwVGUgNqjy8gI/RdQfJ0KxZ4LtmIP1IDXhmaqoQDAw41Xoa2q54PYoc+hbrzKiGXc1RRahIkwoM050gnA7HwDHQlCntZkAAD2FHBZPcvq3AAAAABJRU5ErkJggg==';//The base64 has a imageURL
//
//                // you can get chunks of input data so you can get complete through chunks appending on request.
//                //var byte_string = imageBase64.substr(23);//The base64 has a imageURL
//                var buffer = data.toString('base64');
//                var response = streamifier.createReadStream(buffer).pipe(writeStream);
//                var fileId = response._store.fileId;
//                writeStream.on("finish",function(){
//                    db.close();
//                    console.log("Finished writing the stream.");
//                    new mongooseDBObjects.var_video_screening_candidates_answers({
//                        interviewId : req.param('interviewId'),
//                        questionId : req.param('questionId'),
//                        userId : req.param('userId'),
//                        fileName : fileName,
//                        videoAnswerId : fileId,
//                        lastUpdatedTimeStamp : new Date(),
//                        lastUpdatedBy: 'device'
//                    }).save(function(err,answer,count){
//                            if(err) return console.log(err);
//                            //res.status(200);
//                            //res.json({id:answer._id,interviewId:answer.interviewId,questionId:answer.questionId,userId:answer.userId,
//                                //videoAnswerId:answer.videoAnswerId});
//                        });
//                });
//
//            });
//            fs.writeFile(path,data,function(err){
//                res.send('Upload Success');
//            });
//        });
//    });
//    form.on('error',function(err){
//        console.log('Error parsing form: ' + err.stack);
//    });
//}
//
//var GridStore = require('../node_modules/mongodb').GridStore
//exports.receiveStoredAnswerVideo = function(req,res){
//    var fileId = '552fbf7b02a2918854a1f575';
//    var db = new mongo.Db('videoScreeningDB',new mongo.Server('localhost',27017));
//    var output = '';
//    db.open(function(err){
//        if(err)
//            throw err;
//        var gfs = Grid(db,mongo);
////        GridStore.read(db, fileId, function(err, fileData) {
////            console.log(fileData);
////
////            db.close();
////        });
//
//        var readStream = gfs.createReadStream({
//           _id : fileId
//        });
//        readStream.on("data",function(chunk){
//            output+=chunk;
//        });
//        readStream.on("end",function(){
//            var path = "E:/temp/1.wmv";
//           //console.log("here it is: " + output);
//           //console.log("from base64: " + new Buffer(output,"base64"));
//            var buffer = new Buffer(output, "binary");
//            console.log("one");
//            console.log(buffer);
//            fs.writeFile(path,buffer,function(err){
//                console.log("check drive");
//            });
//        });
//    });
//}