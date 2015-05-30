/**
 * Created with JetBrains WebStorm.
 * User: Sulaiman
 * Date: 1/17/15
 * Time: 6:40 PM
 * To change this template use File | Settings | File Templates.
 */

var mongooseDBObjects = require('./MongooseDBObjects.js');
var varEnumClass = require('./EnumClass.js');
var EncryptDecryptPasswordClass = require('./EncryptDecryptPassword');
var GenericAddUserClass = require('./GenericAddUsersClass');
var sessionCompanyId;

exports.testService = function(req,res) {
    res.set('Content-Type', 'application/json');
    res.status(200);
    res.json({result:"Welcome To Video Screening."});
}

exports.createLogin = function(req,res) {
    var createLoginClass = new CreateLoginClass(req,res);
    createLoginClass.createLoginMethod();
}

exports.addManager = function(req,res){
    var createLoginClass = new CreateLoginClass(req,res);
    createLoginClass.createLoginMethod();
}

exports.addUser = function(req,res){
    var createLoginClass = new CreateLoginClass(req,res);
    createLoginClass.createLoginMethod();
}

exports.adminLogin = function(req,res) {
    var loginClass = new LoginClass(req,res);
    loginClass.loginMethod();
}

exports.managerLogin = function(req,res) {
    var loginClass = new LoginClass(req,res);
    loginClass.loginMethod();
}

exports.userLogin = function(req,res) {
    var loginClass = new LoginClass(req,res);
    loginClass.loginMethod();
}

exports.editAdmin = function(req,res){
    var editManagerUser = new EditManagerUser(req,res);
    editManagerUser.editManagerUserFunc();
}
exports.editManager = function(req,res){
    var editManagerUser = new EditManagerUser(req,res);
    editManagerUser.editManagerUserFunc();
}

exports.editUser = function(req,res){
    var editManagerUser = new EditManagerUser(req,res);
    editManagerUser.editManagerUserFunc();
}

exports.deleteManager = function(req,res){
    var deleteManager = new DeleteManagerUser(req,res);
    deleteManager.deleteManagerUserFunc();
}

exports.deleteUser = function(req,res){
    var deleteUser = new DeleteManagerUser(req,res);
    deleteUser.deleteManagerUserFunc();
}

exports.listManagers = function(req,res){
    var listManagersClass = new ListManagersClass();
    listManagersClass.listManagersFunction(req,res);
}

exports.listManagersWeb = function(req,res){
    var listManagersWebClass = new ListManagersClass();
    listManagersWebClass.listManagersWebFunction(req,res);
}

exports.listUsers = function(req,res){
    var listUsersClass = new ListUsersClass();
    listUsersClass.listUsersFunction(req,res);
}

exports.webViewLogin = function(req,res) {
    var loginClass = new LoginClass(req,res);
    loginClass.loginMethod();
}

var CreateLoginClass = function(req,res){
    this.req = req;
    this.res = res;
}
CreateLoginClass.prototype.createLoginMethod = (function (createLoginCallback){
    return function(req,res) {
        createLoginCallback(this.req,this.res);
    }
})(createLoginCallbackFunction);

function createLoginCallbackFunction(req,res){
    var ua = req.headers['user-agent'];
    console.log("ua " + ua);
    res.set('Content-Type', 'application/json');
    var firstName = req.param('firstName');
    var lastName = req.param('lastName');
    var userName = req.param('userName');
    var password = req.param('password');
    var email = req.param('email');
    if(typeof(password) != "undefined") {
        var encryptPassword = new EncryptDecryptPasswordClass(req.param("password"));
        var hashPassword = encryptPassword.encryptPasswordFunction();
    }
    var role = req.param('role');
    var phoneNumber = typeof(req.param('phoneNumber')) == "undefined" ? "" : req.param('phoneNumber');
    var company = req.param('company');
    console.log("createdBy: " + req.param('createdBy'));
    var createdBy = typeof(req.param('createdBy')) == "undefined" ? "" : req.param('createdBy');

    if(typeof(firstName) == "undefined" || typeof(lastName) == "undefined" ||  typeof(email) == "undefined"
        || typeof(password) == "undefined" || typeof (userName) == "undefined") {
        res.status(404);
        res.json({result:"Mandatory parameter required"});
    } else {
        if(role == varEnumClass.role["Admin"]){
            var json;
            var genericAddUserClass = new GenericAddUserClass(firstName,lastName,userName,email,password,role,phoneNumber,company,createdBy,req,res);
            genericAddUserClass.genericAddFunction(GenericAddUserClass.createGenericCallbackFunction);
            /*genericAddUserClass.genericAddFunction(GenericAddUserClass.createGenericCallbackFunction,function(result){
                console.log("Returned JSON: " + json);
                res.status(result.status);
                res.json({result:result.msg});
            });*/
        } else if(role == varEnumClass.role["Manager"]) {
            /*res.json({id:createUserLogin._id,firstName:createUserLogin.firstName,lastName:createUserLogin.lastName,
            email:createUserLogin.email});*/
            if(/iOS/.test(ua) || /Android/.test(ua)){
                var genericAddUserClass = new GenericAddUserClass(firstName,lastName,userName,email,password,role,phoneNumber,company,createdBy,req,res);
                genericAddUserClass.getCompany(createdBy,function(companyName){
                    if(companyName == false){
                        res.json({result:"Created by id not found."});
                    } else {
                        console.log("company name returned: " + companyName);
                        //genericAddUserClass.companyName = companyName;
                        genericAddUserClass.genericAddFunction(GenericAddUserClass.createGenericCallbackFunction,companyName);
                    }
                });

            } else {
                createdBy = req.session.userId;
                var genericAddUserClass = new GenericAddUserClass(firstName,lastName,userName,email,password,role,phoneNumber,company,createdBy,req,res);
                genericAddUserClass.getCompany(createdBy,function(companyName){
                    if(companyName == false){
                        res.json({result:"Created by id not found."});
                    } else {
                        console.log("company name returned: " + companyName);
                        //genericAddUserClass.companyName = companyName;
                        genericAddUserClass.genericAddFunction(GenericAddUserClass.createGenericCallbackFunction,companyName);
                    }
                });
            }

        } else if(role == varEnumClass.role["User"]) {
            /*res.json({id:createUserLogin._id,firstName:createUserLogin.firstName,lastName:createUserLogin.lastName,
                email:createUserLogin.email});*/
            var genericAddUserClass = new GenericAddUserClass(firstName,lastName,userName,email,password,role,phoneNumber,company,createdBy,req,res);
            genericAddUserClass.getCompany(createdBy,function(companyName){
                if(companyName == false){
                    res.json({result:"Created by id not found."});
                } else {
                    console.log("company name returned: " + companyName);
                    //genericAddUserClass.companyName = companyName;
                    genericAddUserClass.genericAddFunction(GenericAddUserClass.createGenericCallbackFunction,companyName);
                }
            });
        } else {
            res.status(404);
            res.json({result:"Please specify the role either (1 or 2 or 3)."});
        }
    }
}

var LoginClass = function(req,res){
    this.req = req;
    this.res = res;
}
LoginClass.prototype.loginMethod = (function (loginCallback){
    return function(req,res) {
        loginCallback(this.req,this.res);
    }
})(loginCallbackFunction);

function loginCallbackFunction(req,res){
    var ua = req.headers['user-agent'];
   // if(ua == 'Mozilla'){
        console.log("in mozilla");
        res.set('Content-Type', 'application/json');
        res.setHeader("Access-Control-Allow-Origin", "*");
    //}
    var userName = req.param('userName');
    var password = req.param('password');
    var userId;
    var firstName;
    var lastName;
    var email;
    var role;
    var createdBy;
    var companyId;
    console.log(userName + " " + password + " " +ua.substring(0,7));
    mongooseDBObjects.var_video_screening_createLogin.find({userName: userName},function(err, getUser){
        if(err) return console.error(err);
        if(getUser.length == "") {
            res.status(404);
            res.json({result : "Invalid User"});
        } else {
            getUser.forEach(function(getUserLoop){
                var decryptPassword = new EncryptDecryptPasswordClass(getUserLoop.password);
                var decryptedPassword = decryptPassword.decryptPasswordFunction();
                if(password != decryptedPassword) {
                    res.status(404);
                    res.json({result : 'Invalid Password'});
                } else {
                    if(getUserLoop.role == varEnumClass.role["Admin"]) {
                        role = "Admin";
                    } else if(getUserLoop.role == varEnumClass.role["Manager"]) {
                        role = "Manager";
                    } else if(getUserLoop.role == varEnumClass.role["User"]) {
                        role = "User";
                    }
                    /*res.json({id:getUserLoop._id, email : getUserLoop.email, firstName : getUserLoop.firstName ,
                        lastName: getUserLoop.lastName, role : role});*/
                    userId = getUserLoop._id;
                    email = getUserLoop.email;
                    firstName = getUserLoop.firstName;
                    lastName = getUserLoop.lastName;
                    createdBy = getUserLoop.createdBy;
                }
            });

            mongooseDBObjects.var_video_screening_company_user.findOne({userId : userId},function(err,companyUser,count){
                if(companyUser != "" && companyUser !=null){
                    companyId = companyUser.companyId;
                    req.session.companyId = companyId;
                    req.session.userId = userId;
                    sessionCompanyId = req.session.companyId;
                    res.status(200);
                    res.json({id:userId, userName : userName, email:email, firstName : firstName ,
                        lastName: lastName, role : role,companyId:companyUser.companyId,createdBy:createdBy});
                }
            });
        }
    });
}

var EditManagerUser = function(req,res){
    this.req = req;
    this.res = res;
}

EditManagerUser.prototype.editManagerUserFunc = (function(editManagerCallback){
    return function(req,res){
        editManagerCallback(this.req,this.res);
    }
})(editManagerCallbackFunction);

function editManagerCallbackFunction(req,res){
    res.set('Content-Type', 'application/json');
    var userId = req.param('userId');
    var firstName = req.param('firstName');
    var lastName = req.param('lastName');
    var userName = req.param('userName');
    var email = req.param('email');
    var password = req.param('password');
    var confirmPassword = req.param('confirmPassword');
    var encryptPassword = new EncryptDecryptPasswordClass(req.param("password"));
    var hashPassword = encryptPassword.encryptPasswordFunction();
    var role;
    //var status = req.param('status');
    var phoneNumber = req.param('phoneNumber');

    if(password != confirmPassword){
        res.status(400);
        res.json({result: "password and confirm password does not match"});
    } else {
        mongooseDBObjects.var_video_screening_createLogin.find({_id : userId},function(err,findUser,count){
            if(findUser != ""){
                findUser.forEach(function(findUserLoop){
                    role = findUserLoop.role;
                    mongooseDBObjects.var_video_screening_createLogin.update({_id : userId},{$set:{
                        firstName:firstName,lastName:lastName,password:hashPassword,phoneNumber:phoneNumber,email:email
                    }},function(err,findUserLoopUpdate,count){
                        if(err) return console.error(err);
                        if(role == 1) {
                            res.status(200);
                            res.json({result:"Admin is updated"});
                        }
                        if(role == 2) {
                            res.status(200);
                            res.json({result:"Manager is updated"});
                        } else if(role == 3) {
                            res.status(200);
                            res.json({result:"User is updated"});
                        }
                    })
                });
            } else {
                res.json({result:"No user found"});
            }
        })
    }
}

var DeleteManagerUser = function(req,res){
    this.req = req;
    this.res = res;
}

DeleteManagerUser.prototype.deleteManagerUserFunc = (function(deleteManagerCallback){
    return function(req,res){
        deleteManagerCallback(this.req,this.res);
    }
})(deleteManagerCallbackFunction);

function deleteManagerCallbackFunction(req,res){
    var userName = req.param('userName');
    var deletedBy = req.param('deletedBy');

    mongooseDBObjects.var_video_screening_createLogin.find({userName:userName},function(err,user,count){
       if(err) return console.error(err);
       user.forEach(function(userLoop){
         if(userLoop != ""){
            if(userLoop.role == varEnumClass.role["Admin"]){
                res.json({result:"admin cannot be deleted"});
            } else if(userLoop.role == varEnumClass.role["Manager"]){
                mongooseDBObjects.var_video_screening_createLogin.find({userName:deletedBy},function(err,deletedByUser,count){
                  if(deletedByUser != ""){
                      deletedByUser.forEach(function(deletedByUserLoop){
                          if(deletedByUserLoop.role == varEnumClass.role["Admin"]){
                              mongooseDBObjects.var_video_screening_createLogin.update({userName:userName},{$set:{status:varEnumClass.status["Deleted"]}},function(err,updateUser,count){
                                  if(err) return console.error(err);
                                  res.json({result:"Manager has been deleted"});
                              })
                          }
                      })
                  } else {
                     res.json({result:"deletedBy user not found"});
                  }
                });
            } else if(userLoop.role == varEnumClass.role["User"]){
                mongooseDBObjects.var_video_screening_createLogin.find({userName:deletedBy},function(err,deletedByUser,count){
                    if(deletedByUser != ""){
                        deletedByUser.forEach(function(deletedByUserLoop){
                            if(deletedByUserLoop.role == varEnumClass["Admin"] || deletedByUserLoop.role == varEnumClass["Manager"]){
                                mongooseDBObjects.var_video_screening_createLogin.update({userName:userName},{$set:{status:varEnumClass.status["Deleted"]}},function(err,updateUser,count){
                                    if(err) return console.error(err);
                                    res.json({result:"User has been deleted"});
                                })
                            }
                        });
                    }
                });
            }
         } else {
             res.json({result:"no user found"});
         }
       })
    });
}

var ListManagersClass = function(){
}

ListManagersClass.prototype.listManagersFunction = function(req,res){
    var jsonManagerArray = [];
    var jsonUserIds = [];
    var jsonManagers = {};
    var companyId = req.param('companyId');
    var companyName;
    if(companyId != null && companyId != "" && typeof(companyId) != "undefined"){
        mongooseDBObjects.var_video_screening_company_user.find({companyId:companyId,role:2},function(err,companyUser,count){
            if(err) throw err;
            console.log("companyUser: " + companyUser);
            if(companyUser != "" && companyUser != null){
                companyUser.forEach(function(companyUserLoop){
                    jsonUserIds.push(companyUserLoop.userId);
                });
                mongooseDBObjects.var_video_screening_company.findOne({_id:companyId},function(err,company,count){
                    if(err) throw err;
                    companyName = company.companyName;

                    mongooseDBObjects.var_video_screening_createLogin.find({_id:{$in:jsonUserIds}},function(err,users,count){
                        if(err) throw err;
                        users.forEach(function(usersLoop){
                            jsonManagers["id"] = usersLoop._id;
                            jsonManagers["firstName"] = usersLoop.firstName;
                            jsonManagers["lastName"] = usersLoop.lastName;
                            jsonManagers["userName"] = usersLoop.userName;
                            jsonManagers["email"] =  usersLoop.email;
                            jsonManagers["company"] = companyName;
                            jsonManagerArray.push(jsonManagers);
                            jsonManagers = {};
                        });
                        res.json(jsonManagerArray);
                    });
                });
            } else {
                res.status(404);
                res.json({result:"No company found against the given id."});
            }
        });
    } else {
        res.status(404);
        res.json({result:"Please provide company Id."});
    }
}

var ListUsersClass = function(){
}

ListUsersClass.prototype.listUsersFunction = function(req,res){
    var jsonUsersArray = [];
    var jsonUserIds = [];
    var jsonUsers = {};
    var companyId = req.param('companyId');
    var companyName;
    if(companyId != null && companyId != "" && typeof(companyId) != "undefined"){
        mongooseDBObjects.var_video_screening_company_user.find({companyId:companyId,role:3},function(err,companyUser,count){
            if(err) throw err;
            if(companyUser != "" && companyUser != null){
                companyUser.forEach(function(companyUserLoop){
                    jsonUserIds.push(companyUserLoop.userId);
                });
                mongooseDBObjects.var_video_screening_company.findOne({_id:companyId},function(err,company,count){
                    if(err) throw err;
                    companyName = company.companyName;

                    mongooseDBObjects.var_video_screening_createLogin.find({_id:{$in:jsonUserIds}},function(err,users,count){
                        if(err) throw err;
                        users.forEach(function(usersLoop){
                            jsonUsers["id"] = usersLoop._id;
                            jsonUsers["firstName"] = usersLoop.firstName;
                            jsonUsers["lastName"] = usersLoop.lastName;
                            jsonUsers["userName"] = usersLoop.userName;
                            jsonUsers["email"] =  usersLoop.email;
                            jsonUsers["company"] = companyName;
                            jsonUsersArray.push(jsonUsers);
                            jsonUsers = {};
                        });
                        res.json(jsonUsersArray);
                    });
                });
            }  else {
                res.status(404);
                res.json({result:"No company found against the given id."});
            }
        });
    } else {
        res.status(404);
        res.json({result:"Please provide company Id."});
    }
}

ListManagersClass.prototype.listManagersWebFunction = function(req,res){
    var jsonManagerArray = [];
    var jsonUserIds = [];
    var jsonManagers = {};
    var companyId = req.session.companyId;
    var companyName;
    if(companyId != null && companyId != "" && typeof(companyId) != "undefined"){
        mongooseDBObjects.var_video_screening_company_user.find({companyId:companyId,role:2},function(err,companyUser,count){
            if(err) throw err;
            console.log("companyUser: " + companyUser);
            if(companyUser != "" && companyUser != null){
                companyUser.forEach(function(companyUserLoop){
                    jsonUserIds.push(companyUserLoop.userId);
                });
                mongooseDBObjects.var_video_screening_company.findOne({_id:companyId},function(err,company,count){
                    if(err) throw err;
                    companyName = company.companyName;

                    mongooseDBObjects.var_video_screening_createLogin.find({_id:{$in:jsonUserIds}},function(err,users,count){
                        if(err) throw err;
                        users.forEach(function(usersLoop){
                            jsonManagers["id"] = usersLoop._id;
                            jsonManagers["firstName"] = usersLoop.firstName;
                            jsonManagers["lastName"] = usersLoop.lastName;
                            jsonManagers["userName"] = usersLoop.userName;
                            jsonManagers["email"] =  usersLoop.email;
                            jsonManagers["company"] = companyName;
                            jsonManagerArray.push(jsonManagers);
                            jsonManagers = {};
                        });
                        res.json(jsonManagerArray);
                    });
                });
            } else {
                res.status(404);
                res.json({result:"No company found against the given id."});
            }
        });
    } else {
        res.status(404);
        res.json({result:"Please provide company Id."});
    }
}

exports.sessionCompanyId = sessionCompanyId;