/**
 * Created with JetBrains WebStorm.
 * User: Sulaiman
 * Date: 3/8/15
 * Time: 12:22 PM
 * To change this template use File | Settings | File Templates.
 */
//var varSessionCompanyId;
//define(function (require) {
//    var foo = require('../../routes/LoginService');
//
//    //Define this module as exporting a function
//    varSessionCompanyId = foo.sessionCompanyId;
//});
//alert(varSessionCompanyId);
$(document).ready(function() {
    $('#adminDropDown').css('display','none');

    $('#viewAdmin').click(function(){
        $('#adminDropDown').toggle();
    });

    $('#managerFormDiv').dialog({
        autoOpen: false,
        height: 500,
        width: 515,
        modal: true
    });

    $('#companyProfileDiv').dialog({
        autoOpen: false,
        height: 500,
        width: 515,
        modal: true
    });

    $('#addManager').click(function(){
        $('#managerFormDiv').dialog('open');
    });

    $('#viewManagers').click(function(){

    });

    $('#companyProfile').click(function(){
        $('#companyProfileDiv').dialog('open');
    });
})
