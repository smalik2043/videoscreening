/**
 * Created by Sulaiman on 12/3/2015.
 */

exports.logout = function(req,res){
    console.log("logout");
    req.session.companyId = null;
    req.session.userId = null;
    res.json({status:"success"});
}