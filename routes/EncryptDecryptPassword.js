/**
 * Created with JetBrains WebStorm.
 * User: Sulaiman
 * Date: 12/24/13
 * Time: 12:53 PM
 * To change this template use File | Settings | File Templates.
 */

function EncryptDecryptPasswordClass(password){
    this.password = password;
}
EncryptDecryptPasswordClass.prototype.encryptPasswordFunction = function() {
    return new Buffer(this.password).toString('base64');
}

EncryptDecryptPasswordClass.prototype.decryptPasswordFunction = function() {
    console.log("dec password " + this.password);
    return new Buffer(this.password, 'base64').toString('ascii');
}

module.exports = EncryptDecryptPasswordClass;
