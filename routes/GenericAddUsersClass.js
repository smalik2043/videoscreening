/**
 * Created with JetBrains WebStorm.
 * User: Sulaiman
 * Date: 1/28/15
 * Time: 12:27 AM
 * To change this template use File | Settings | File Templates.
 */
var mongooseDBObjects = require('./MongooseDBObjects.js');
var varEnumClass = require('./EnumClass.js');
var EncryptDecryptPasswordClass = require('./EncryptDecryptPassword');
var GenericAddUserClass = function(firstName, lastName, userName, email, password, role, phoneNumber, company, createdBy, req, res){
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.email = email;
    var encryptPassword = new EncryptDecryptPasswordClass(password);
    this.password = encryptPassword.encryptPasswordFunction();
    this.role = role;
    this.phoneNumber = phoneNumber;
    this.companyName = typeof(company) == "undefined" ? "" : company;
    this.createdBy = createdBy;
    this.req = req;
    this.res = res;
}
//GenericAddUserClass.prototype.genericAddFunction = (function (createGenericCallback){
//    return function(json) {
//        createGenericCallback(this.firstName,this.lastName,this.userName,this.password,this.role,this.phoneNumber,this.email,this.companyName);
//        console.log("Callback value returned: " + json);
//        return json;
//    }
//})(createGenericCallbackFunction);

GenericAddUserClass.prototype.genericAddFunction = function (createGenericCallback,company){

    console.log("company name in callback : " + company);
    company = typeof(company) == "undefined" ? this.companyName : company;
    createGenericCallback(this.firstName,this.lastName,this.userName,this.email,this.password,this.role,this.phoneNumber, company, this.createdBy, this.req, this.res);
        /*createGenericCallback(this.firstName,this.lastName,this.userName,this.password,this.role,this.phoneNumber,this.email,this.companyName,function(result){
           fn(result);
           console.log("Well it should work: " + result);
        });*/
}

function createGenericCallbackFunction(firstName, lastName, userName, email, password, role, phoneNumber, company, createdBy, req, res){
    var userId;
    var companyExist = false;
    var companyResultLoopId;
    var companyNameExist;
    var getCompanyName;
    var companyId;
    var userCompanyId;
    var jsonArray = [];
    console.log("created by in callback: " + createdBy);

    mongooseDBObjects.var_video_screening_createLogin.find({userName : userName},function(err,user){
        if(user != ""){
            user.forEach(function(userLoop){
                userId = userLoop._id;
                mongooseDBObjects.var_video_screening_company.find(function (err, companyResult, count) {
                    companyResult.forEach(function(companyResultLoop){
                        if(companyResultLoop.companyName.toLowerCase() == company.toLowerCase()) {
                            companyNameExist = true;
                            companyResultLoopId = companyResultLoop._id;
                            getCompanyName = companyResultLoop.companyName;
                            console.log("company exist " + companyNameExist);
                        }
                    });

                    if(companyNameExist == true) {
                        companyExist = true;
                        //companyResult.forEach(function (companyLoop) {
                        company = companyResultLoopId;
                        mongooseDBObjects.var_video_screening_company_user.find({companyId: companyResultLoopId, userId: userId}, function(err, companyUser, count){
                            if(companyUser == "") {
                                console.log("exist comp " + company);
                                new mongooseDBObjects.var_video_screening_company_user({
                                    companyId: company,
                                    userId: userId,
                                    role : parseInt(role),
                                    status : varEnumClass.status["Active"],
                                    createdBy : createdBy,
                                    lastUpdatedTimeStamp : new Date(),
                                    lastUpdatedBy: 'admin'
                                }).save(function (err, companyUserResult, count) {
                                        if (err) throw err;
                                        res.status(200);
                                        if(role == varEnumClass.role["Admin"]) {
                                            res.json({result:"admin created",
                                                "firstName":firstName,
                                                "lastName":lastName,
                                                "userName":userName,
                                                "email": email,
                                                "adminId" : userId,
                                                "companyId":company,
                                                "companyName":getCompanyName});
                                        } else if(role == varEnumClass.role["Manager"]) {
                                            res.json({result:"manager created",
                                                "firstName":firstName,
                                                "lastName":lastName,
                                                "userName":userName,
                                                "email": email,
                                                "managerId" : userId,
                                                "companyId":company,
                                                "companyName":getCompanyName});
                                        } else if(role == varEnumClass.role["User"]) {
                                            res.json({result:"user created",
                                                "firstName":firstName,
                                                "lastName":lastName,
                                                "userName":userName,
                                                "email": email,
                                                "userId" : userId,
                                                "companyId":company,
                                                "companyName":getCompanyName});
                                        }
                                    })
                            } else {
                                companyUser.forEach(function(companyUSerLoop){
                                    if(companyUSerLoop.role == role) {
                                        res.status(404);
                                        res.json({result:"User already registered with specified role and the company."});
                                    } else {
                                        console.log("exist comp " + company);
                                        new mongooseDBObjects.var_video_screening_company_user({
                                            companyId: company,
                                            userId: userId,
                                            role : parseInt(role),
                                            status : varEnumClass.status["Active"],
                                            createdBy : createdBy,
                                            lastUpdatedTimeStamp : new Date(),
                                            lastUpdatedBy: 'admin'
                                        }).save(function (err, companyUserResult, count) {
                                                if (err) throw err;
                                                res.status(200);
                                                res.json({result:"company admin saved"});
                                                if(role == varEnumClass.role["Admin"]) {
                                                    res.json({result:"admin created",
                                                        "firstName":firstName,
                                                        "lastName":lastName,
                                                        "userName":userName,
                                                        "email": email,
                                                        "adminId" : userId,
                                                        "companyId":company,
                                                        "companyName":getCompanyName});
                                                } else if(role == varEnumClass.role["Manager"]) {
                                                    res.json({result:"manager created",
                                                        "firstName":firstName,
                                                        "lastName":lastName,
                                                        "userName":userName,
                                                        "email": email,
                                                        "managerId" : userId,
                                                        "companyId":company,
                                                        "companyName":getCompanyName});
                                                } else if(role == varEnumClass.role["User"]) {
                                                    res.json({result:"user created",
                                                        "firstName":firstName,
                                                        "lastName":lastName,
                                                        "userName":userName,
                                                        "email": email,
                                                        "userId" : userId,
                                                        "companyId":company,
                                                        "companyName":getCompanyName});
                                                }
                                            })
                                    }
                                });
                            }
                        });

                        //});
                    } else {
                        companyExist = false;
                        console.log("companyExist" + companyExist);
                        new mongooseDBObjects.var_video_screening_company({
                            companyName: company
                        }).save(function (err, companyNameResult, count) {
                                if (err) throw err;
                                companyId = companyNameResult._id;
                                new mongooseDBObjects.var_video_screening_company_user({
                                    companyId: companyId,
                                    userId: userId,
                                    role : parseInt(role),
                                    status : varEnumClass.status["Active"],
                                    createdBy : createdBy,
                                    lastUpdatedTimeStamp : new Date(),
                                    lastUpdatedBy: 'admin'
                                }).save(function (err, companyUserResult, count) {
                                        if (err) throw err;
                                        res.status(200);
                                        if(role == varEnumClass.role["Admin"]) {
                                            res.json({result:"admin created",
                                                "firstName":firstName,
                                                "lastName":lastName,
                                                "userName":userName,
                                                "email": email,
                                                "adminId" : userId,
                                                "companyId":companyId,
                                                "companyName":company});
                                        } else if(role == varEnumClass.role["Manager"]) {
                                            res.json({result:"manager created",
                                                "firstName":firstName,
                                                "lastName":lastName,
                                                "userName":userName,
                                                "email": email,
                                                "managerId" : userId,
                                                "companyId":companyId,
                                                "companyName":company});
                                        } else if(role == varEnumClass.role["User"]) {
                                            res.json({result:"user created",
                                                "firstName":firstName,
                                                "lastName":lastName,
                                                "userName":userName,
                                                "email": email,
                                                "userId" : userId,
                                                "companyId":companyId,
                                                "companyName":company});
                                        }
                                    })
                            })
                    }
                });
            })
        } else {
            new mongooseDBObjects.var_video_screening_createLogin({
                firstName : firstName,
                lastName : lastName,
                password :  password,
                role : parseInt(role),
                status : varEnumClass.status["Active"],
                phoneNumber : phoneNumber,
                userName : userName,
                email : email,
                createdBy : createdBy,
                lastUpdatedTimeStamp : new Date(),
                lastUpdatedBy: 'admin'
            }).save(function(err,createUserLogin,count){
                    if(err) return console.error(err);
                    //res.json({result:"Admin has been created successfully."});
                    userId = createUserLogin._id;
                    mongooseDBObjects.var_video_screening_company.findOne({companyName:company},function(err,companyUser,count){
                        if(companyUser != null && companyUser != "") {
                            //console.log(companyUser.companyName.toLowerCase() + " " + companyUser.toLowerCase());
                            //console.log("a " + new RegExp("^" + companyUser.companyName.toLowerCase(), "i") + " " + new RegExp("^" + companyUser.toLowerCase(), "i"));
                            if(companyUser.companyName.toLowerCase() == company.toLowerCase()) {
                                companyNameExist = true;
                                companyResultLoopId = companyUser._id;
                                getCompanyName = companyUser.companyName;
                                console.log("company exist " + companyNameExist);
                            }
                        }
                        if(companyNameExist == true){
                            companyExist = true;
                            company = companyResultLoopId;
                            console.log("exist comp " + company);

                            new mongooseDBObjects.var_video_screening_company_user({
                                companyId : company,
                                userId : userId,
                                role : parseInt(role),
                                status : varEnumClass.status["Active"],
                                createdBy : createdBy,
                                lastUpdatedTimeStamp : new Date(),
                                lastUpdatedBy: 'admin'
                            }).save(function(err,createCompanyUser,count){
                                    if(err) throw err;
                                    res.status(200);
                                    if(role == varEnumClass.role["Admin"]) {
                                        res.json({result:"admin created",
                                            "firstName":firstName,
                                            "lastName":lastName,
                                            "userName":userName,
                                            "email": email,
                                            "adminId" : userId,
                                            "companyId":company,
                                            "companyName":getCompanyName});
                                    } else if(role == varEnumClass.role["Manager"]) {
                                        res.json({result:"manager created",
                                            "firstName":firstName,
                                            "lastName":lastName,
                                            "userName":userName,
                                            "email": email,
                                            "managerId" : userId,
                                            "companyId":company,
                                            "companyName":getCompanyName});
                                    } else if(role == varEnumClass.role["User"]) {
                                        res.json({result:"user created",
                                            "firstName":firstName,
                                            "lastName":lastName,
                                            "userName":userName,
                                            "email": email,
                                            "userId" : userId,
                                            "companyId":company,
                                            "companyName":getCompanyName});
                                    }
                                });
                        } else {
                            companyExist = false;
                            console.log("companyExist" + companyExist);
                            new mongooseDBObjects.var_video_screening_company({
                                companyName: company
                            }).save(function (err, companyNameResult, count) {
                                    if (err) throw err;
                                    companyId = companyNameResult._id;
                                    new mongooseDBObjects.var_video_screening_company_user({
                                        companyId: companyId,
                                        userId: userId,
                                        role : parseInt(role),
                                        status : varEnumClass.status["Active"],
                                        createdBy : createdBy,
                                        lastUpdatedTimeStamp : new Date(),
                                        lastUpdatedBy: 'admin'
                                    }).save(function (err, companyUserResult, count) {
                                            if (err) throw err;
                                            res.status(200);
                                            if(role == varEnumClass.role["Admin"]) {
                                                res.json({result:"admin created",
                                                            "firstName":firstName,
                                                            "lastName":lastName,
                                                            "userName":userName,
                                                            "email": email,
                                                            "adminId" : userId,
                                                            "companyId":companyId,
                                                            "companyName":company});
                                            } else if(role == varEnumClass.role["Manager"]) {
                                                res.json({result:"manager created",
                                                            "firstName":firstName,
                                                            "lastName":lastName,
                                                            "userName":userName,
                                                            "email": email,
                                                            "managerId" : userId,
                                                            "companyId":companyId,
                                                            "companyName":company});
                                            } else if(role == varEnumClass.role["User"]) {
                                                res.json({result:"user created",
                                                            "firstName":firstName,
                                                            "lastName":lastName,
                                                            "userName":userName,
                                                            "email": email,
                                                            "userId" : userId,
                                                            "companyId":companyId,
                                                            "companyName":company});
                                            }

                                        })
                                })
                        }
                    })
//                            res.json({id:createUserLogin._id,firstName:createUserLogin.firstName,lastName:createUserLogin.lastName,
//                                email:createUserLogin.email});
                })
        }
    });
}

//returning a company value from callback function
GenericAddUserClass.prototype.getCompany = function (createdBy,callback){
    var userCompanyId;
    var company;
    if(createdBy != undefined){
        mongooseDBObjects.var_video_screening_company_user.findOne({userId : createdBy}, function(err,userCompany){
            if(userCompany != "" && userCompany != null){
                userCompanyId = userCompany.companyId;
            }
            mongooseDBObjects.var_video_screening_company.findOne({_id:userCompanyId},function(err,companyCallBack){
                if(companyCallBack != "" && userCompany != null){
                    company = companyCallBack.companyName;
                    console.log("Company info: " + company);
                    callback(company);
                } else {
                    company = false;
                    callback(company);
                }
            });
        })
    } else {
        createdBy = "";
    }
}

module.exports = GenericAddUserClass;
module.exports.createGenericCallbackFunction = createGenericCallbackFunction;
//module.exports.getCompanyCallbackFunction = getCompanyCallbackFunction;