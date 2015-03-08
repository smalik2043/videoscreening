/**
 * Created with JetBrains WebStorm.
 * User: Sulaiman
 * Date: 3/8/15
 * Time: 12:22 PM
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function() {
    $('#adminDropDown').css('display','none');

    $('#viewAdmin').click(function(){
        $('#adminDropDown').toggle();
    });
})
