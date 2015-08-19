/**
 * Created with JetBrains WebStorm.
 * User: Sulaiman
 * Date: 12/4/13
 * Time: 1:46 PM
 * To change this template use File | Settings | File Templates.
 */

var ipaddress = config.ipaddress;
$(document).ready(function(){
    $("#newUserBtn").click(function(){
        document.location.href = ipaddress+'/signup';
    });

    $("#forgotPasswordBtn").click(function(){
        document.location.href = ipaddress+'/forgotPasswordView';
    });
    /*$("#loginForm").submit(function() {
        var url = ipaddress+'/webViewLogin';

        $.ajax({
            type: "POST",
            url: url,
            data: $("#loginForm").serialize(), // serializes the form's elements.
            success: function(data)
            {
                alert(data.result);
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert(jqXHR.result);
            }
        });
        return false;
    });*/
})