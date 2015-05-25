/**
 * Created with JetBrains WebStorm.
 * User: Sulaiman
 * Date: 4/7/15
 * Time: 8:06 PM
 * To change this template use File | Settings | File Templates.
 */

var mongooseDBObjects = require('./MongooseDBObjects.js');
var company_name;
exports.getCompanyName = function(req,res) {
    console.log("get company from session: " + req.session.companyId);
    mongooseDBObjects.var_video_screening_company.findOne({_id: req.session.companyId},{companyName:1}, function(err, companyList,count){
        if(companyList!=null && companyList!=""){
            company_name = companyList.companyName;
        }
        console.log("company_name " + company_name);
        res.json({result: company_name});
    });
}

exports.getCompanyNameApi = function(req,res) {
    res.set('Content-Type', 'application/json');
    var companyName;
    var companyId;
    mongooseDBObjects.var_video_screening_company.findOne({_id: req.param('companyId')},{companyName:1}, function(err, companyList,count){
        if(companyList!=null && companyList!=""){
            companyName = companyList.companyName;
            companyId = companyList._id;
        }
        console.log("company_name " + company_name);
        res.status(200);
        res.json({companyId:companyId,companyName: companyName});
    });
}

exports.changeCompanyName = function(req,res){
    res.set('Content-Type', 'application/json');
    var companyId = req.param("companyId");
    var companyName = req.param("companyName");
    mongooseDBObjects.var_video_screening_company.findOne({_id: companyId},function(err, companyList,count){
        if(companyList!=null && companyList!=""){
            mongooseDBObjects.var_video_screening_company.update({_id:companyId},{$set:{companyName:companyName}},function(err,company,count){
               res.json({result:"companyUpdated"});
            });
        }
        console.log("company_name " + company_name);
        res.status(200);
        res.json({result: "Company name updated."});
    });
}

exports.webChangeCompanyName = function(req,res){
    res.set('Content-Type', 'application/json');
    var companyId = req.session.companyId;
    var companyName = req.param("companyName");
    mongooseDBObjects.var_video_screening_company.findOne({_id: companyId},function(err, companyList,count){
        if(companyList!=null && companyList!=""){
            mongooseDBObjects.var_video_screening_company.update({_id:companyId},{$set:{companyName:companyName}},function(err,company,count){
                res.json({result:"companyUpdated"});
            });
        }
        res.status(200);
        res.json({result: "Company name updated."});
    });
}
