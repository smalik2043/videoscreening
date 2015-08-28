/**
 * Created with JetBrains WebStorm.
 * User: Sulaiman
 * Date: 12/19/13
 * Time: 5:30 PM
 * To change this template use File | Settings | File Templates.
 */

var mailOptions = {};
var smtpTransport;
var nodeMailer = require('nodemailer');
var configuration = require('./Configuration.js');
function MailerClass() {
    this.URLAddress = configuration.URLAddress;
}
MailerClass.prototype.mailOptionsFunc = function(emailAddress,userName,password,assignTo){
    console.log("mailOptionsFunc " + emailAddress);
        mailOptions = {
            from: "Admin <sulaiman@technosurge.com>", // sender address
            to: emailAddress, // list of receivers
            subject: "Video Screening Web User Account.", // Subject line
            text: "Dear User! Your Video Screening web user account has been created successfully.", // plaintext body
            html: "<b>Dear User!</br> Your Video Screening web user account has been created successfully.Your username is " + userName + " Please click the link below " +
                "<a href="+this.URLAddress+">Video Screening</a></b>" // html body
        }

    return mailOptions;
}
MailerClass.prototype.smtpTransportConfiguration = function() {
    smtpTransport = nodeMailer.createTransport({
        service: "Mandrill",
        auth: {
            user: configuration.email,
            pass: configuration.password
        }
    });
}
MailerClass.prototype.sendEmailSMTP = function(mailJson) {
    smtpTransport.sendMail(mailJson, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        smtpTransport.close(); // shut down the connection pool, no more messages
    });
}
MailerClass.prototype.sendMail = function(emailAddress,userName,password,assignTo) {
    console.log("sendMail " + emailAddress);
    var mailJson = this.mailOptionsFunc(emailAddress,userName,password,assignTo);
    this.smtpTransportConfiguration();
    this.sendEmailSMTP(mailJson);

}

function ForgotMailerLinkClass() {
    this.URLAddress = configuration.URLAddress;
}
ForgotMailerLinkClass.prototype.mailOptionsFunc = function(emailAddress,uuid){
    console.log("mailOptionsFunc " + emailAddress + "uuid " + uuid);
    var resetLink = this.URLAddress+"resetPasswordView?uuid="+uuid;
    mailOptions = {
        from: "Admin <sulaiman.malik@gmail.com>", // sender address
        to: emailAddress, // list of receivers
        subject: "Reset Your Video Screening Password", // Subject line
        text: "Dear User! Click on the following link to reset your password.", // plaintext body
        html: "Video Screening has received a request to reset your password for your account." +
              "<a href="+resetLink+" style=font-size:14px;font-weight:bold;color:white;border:1px;solid:#21aa13;background:#93da46;>Reset Password Now</a></b>" // html body
    }
    return mailOptions;
}
ForgotMailerLinkClass.prototype.smtpTransportConfiguration = function() {
    smtpTransport = nodeMailer.createTransport({
        service: "Mandrill",
        auth: {
            user: configuration.email,
            pass: configuration.password
        }
    });
}
ForgotMailerLinkClass.prototype.sendEmailSMTP = function(mailJson) {
    smtpTransport.sendMail(mailJson, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
        // if you don't want to use this transport object anymore, uncomment following line
        smtpTransport.close(); // shut down the connection pool, no more messages
    });
}
ForgotMailerLinkClass.prototype.sendMail = function(emailAddress,uuid) {
    console.log("sendMail " + emailAddress + "uuid " + uuid);
    var mailJson = this.mailOptionsFunc(emailAddress,uuid);
    this.smtpTransportConfiguration();
    this.sendEmailSMTP(mailJson);

}
module.exports = MailerClass;
module.exports.ForgotMailerLinkClass = ForgotMailerLinkClass;
