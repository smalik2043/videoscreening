/**
 * Created with JetBrains WebStorm.
 * User: Sulaiman
 * Date: 12/24/13
 * Time: 12:26 PM
 * To change this template use File | Settings | File Templates.
 */
var mongooseDBObjects = require('./MongooseDBObjects.js');
var EncryptDecryptPasswordClass = require('./EncryptDecryptPassword');
var GenericUserResetClass= require('./UserProfileResetPasswordClass');

exports.resetUserPassword = function(req,res) {
    var uuid = req.param('uuid');
    var password = req.param('password');
    var encryptPassword = new EncryptDecryptPasswordClass(password);
    password = encryptPassword.encryptPasswordFunction();
    var resetPasswordClass = new GenericUserResetClass.ResetPasswordClass(uuid,password,"",req,res);
    resetPasswordClass.savePasswordAndProfile();
}

exports.forgotUserPassword = function(req,res) {
    var email = req.param('email');
    var thisreq = req;
    var thisres = res;
    var forgotYourPassword = new GenericUserResetClass.ForgotYourPasswordClass(email,"","",thisreq,thisres);
    forgotYourPassword.sendForgotYourPasswordLinkFunc();
}

exports.resetUserProfile = function(req,res) {
    var email = req.body.emailReset;
    var password = req.body.passwordReset;
    var imagePath;
    var encryptPassword = new EncryptDecryptPasswordClass(password);
    password = encryptPassword.encryptPasswordFunction();
    //var genericResetClass = new GenericUserResetClass.GenericResetClass(email,password,req,res);
    //GenericUserResetClass.UserProfileResetClass.prototype = new GenericUserResetClass.GenericResetClass(email,password,req,res);
    var userProfileResetClass = new GenericUserResetClass.UserProfileResetClass(email,password,trackBy,req,res);
    userProfileResetClass.savePasswordAndProfile();
}
