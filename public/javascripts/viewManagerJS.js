/**
 * Created with JetBrains WebStorm.
 * User: Sulaiman
 * Date: 4/12/15
 * Time: 7:18 PM
 * To change this template use File | Settings | File Templates.
 */

$.ajax({
    url: config.ipaddress+'/listManagersWeb',
    type: 'GET',
    success: function(data, textStatus, jqXHR) {
        var i = 0;
        $.each(data,function(index,result){
            $("<tr></tr>").attr("id",i+"rcdTr").appendTo("#viewManagerTBody");
            $("<td></td>").attr("id",i+"id").appendTo("#"+i+"rcdTr");
            $("#"+i+"id").html(result.id);

            $("<td></td>").attr("id",i+"firstName").appendTo("#"+i+"rcdTr");
            $("#"+i+"firstName").html(result.firstName);

            $("<td></td>").attr("id",i+"lastName").appendTo("#"+i+"rcdTr");
            $("#"+i+"lastName").html(result.lastName);

            $("<td></td>").attr("id",i+"userName").appendTo("#"+i+"rcdTr");
            $("#"+i+"userName").html(result.userName);

            $("<td></td>").attr("id",i+"email").appendTo("#"+i+"rcdTr");
            $("#"+i+"email").html(result.email);

            i = i+1;
        });
        $('#managerTable').DataTable();
    },
    error: function (jqXHR, textStatus, errorThrown)
    {

    }

});
