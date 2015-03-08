/**
 * Created with JetBrains WebStorm.
 * User: Sulaiman
 * Date: 1/9/14
 * Time: 12:59 PM
 * To change this template use File | Settings | File Templates.
 */

var mongooseDBObjects = require('./MongooseDBObjects.js');
var EncryptDecryptPasswordClass = require('./EncryptDecryptPassword');
var fs = require('fs');
var ForgotMailerLinkClass = require('./MailerClass');
//var gm = require('gm').subClass({ imageMagick: true });
//var im = require('imagemagick');

//Parent Class
function GenericResetClass(email,password,req,res){
    this.email = email;
    this.password = password;
    this.req = req;
    this.res = res;
}

GenericResetClass.prototype.getEmail = function() {
    return this.email;
}
GenericResetClass.prototype.getPassword = function() {
    return this.password;
}
GenericResetClass.prototype.getRequest = function() {
    return this.req;
}
GenericResetClass.prototype.getResponse = function() {
    return this.res;
}
GenericResetClass.prototype.savePasswordAndProfile = function() {
    console.log("In base class function.");
}
GenericResetClass.prototype.sendForgotYourPasswordLinkFunc = function() {
    console.log("In base class function.");
}

//Child Class(For Forgot Password)
function ForgotYourPasswordClass(email,password,req,res){
    GenericResetClass.call(this,email,"",req,res);
}
ForgotYourPasswordClass.prototype = Object.create(GenericResetClass.prototype);
ForgotYourPasswordClass.prototype.sendForgotYourPasswordLinkFunc = function(){
    var email = this.getEmail();
    var req = this.getRequest();
    var res = this.getResponse();
    var getUUID = guid();
    console.log("uuid " + getUUID);
    mongooseDBObjects.var_video_screening_createLogin.find({email: email}, function(err, employee, count){
        if(employee == "") {
            res.json({result:"email not found."});
        } else {
            mongooseDBObjects.var_video_screening_createLogin.update({email:email},{$set:{uuid: getUUID}},function(err,employee,count){
                var forgotMailerLinkObject = new ForgotMailerLinkClass.ForgotMailerLinkClass();
                forgotMailerLinkObject.sendMail(req.param("email"),getUUID);
                res.json({result:"email sent"});
            });
        }
    });
}
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function guid() {
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
//Child Class(For Password Reset.)
function ResetPasswordClass(email,password,req,res){
    GenericResetClass.call(this, email, password,req,res);
}
ResetPasswordClass.prototype = Object.create(GenericResetClass.prototype);
ResetPasswordClass.prototype.savePasswordAndProfile = function() {
    var uuid = this.getEmail();
    var password = this.getPassword();
    var req = this.getRequest();
    var res =this.getResponse();
    console.log("from param " + uuid);
    mongooseDBObjects.var_video_screening_createLogin.find({uuid: uuid}, function(err, employee, count){
        if(employee == "") {
            res.json({result:"email not found."})
        } else {
            mongooseDBObjects.var_video_screening_createLogin.update({uuid:uuid},{$set:{password: password,uuid : ""}}, function(err,updateEmployee,count){
                res.json({result:""});
            });
        }
    });
}

//Child Class(For User Profile Password and Image reset.)

function UserProfileResetClass(email,password,req,res){
    GenericResetClass.call(this, email, password,req,res);
}
UserProfileResetClass.prototype = Object.create(GenericResetClass.prototype);
UserProfileResetClass.prototype.savePasswordAndProfile = function() {
    var email = this.getEmail();
    var password = this.getPassword();
    var req = this.getRequest();
    var res =this.getResponse();
    var imagePath;
    var obj = req.files;
    var employeeID;

//    for(var key in obj) {
//        if(key == "uploadUserImage") {
//            imagePath = req.files.uploadUserImage.path;
//        } else {
//            imagePath == undefined;
//        }
//    }
    mongooseDBObjects.var_video_screening_createLogin.find({email:email},{_id:1},function(err,employee,count){
          employee.forEach(function(employeeLoop){
             employeeID = employeeLoop._id;
          });
        var jsonString = {};
        /*if(password == undefined || password == "") {
            var var_user_profile_image = {};
            var_user_profile_image["data"] = fs.readFileSync(imagePath);

            console.log("image path " + imagePath);
            fs.writeFile('public/images/'+employeeID+'.png', var_user_profile_image["data"], 'binary', function(err){
                if (err) throw err
                console.log('File saved.')
            })

        } if(imagePath == undefined) {
            jsonString["password"] = password;
        } if(imagePath != undefined && password != "") {
            var var_user_profile_image = {};
            var_user_profile_image["data"] = fs.readFileSync(imagePath);
            //var_user_profile_image["contentType"] = 'image/png';

            fs.writeFile('public/images/'+employeeID+'.png', var_user_profile_image["data"], 'binary', function(err){
                if (err) throw err
                console.log('File saved.')
            })
            //jsonString["employee_image"] = var_user_profile_image;
            jsonString["password"] = password;
        }*/
        jsonString["password"] = password;
        mongooseDBObjects.var_video_screening_createLogin.update({email:email},{$set:jsonString},function(err,company,count){
            //mongooseDBObjects.var_video_screening_company_user.update({employee_id: req.session.name,company_id : req.session.company },{ $set: {track_by:trackBy}},function(err,doc,count){
                res.json({result: "success"});
            //});
        });
    });

}


module.exports.GenericResetClass = GenericResetClass;
module.exports.ResetPasswordClass = ResetPasswordClass;
module.exports.UserProfileResetClass = UserProfileResetClass;
module.exports.ForgotYourPasswordClass = ForgotYourPasswordClass;