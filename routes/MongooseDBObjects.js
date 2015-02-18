/**
 * Created with JetBrains WebStorm.
 * User: Sulaiman
 * Date: 1/17/15
 * Time: 6:36 PM
 * To change this template use File | Settings | File Templates.
 */

var videoScreeningDB = require('../node_modules/mongoose');

var video_screening_createLogin = videoScreeningDB.model('videoScreeningCreateLogin');
var video_screening_company = videoScreeningDB.model('videoScreeningCompany');
var video_screening_company_user = videoScreeningDB.model('videoScreeningCompanyUser');
var video_screening_interview = videoScreeningDB.model('videoScreeningInterview');
var video_screening_question = videoScreeningDB.model('videoScreeningQuestion');
var video_screening_candidates = videoScreeningDB.model('videoScreeningCandidates');

module.exports.var_video_screening_createLogin = video_screening_createLogin;
module.exports.var_video_screening_company = video_screening_company;
module.exports.var_video_screening_company_user = video_screening_company_user;
module.exports.var_video_screening_interview = video_screening_interview;
module.exports.var_video_screening_question = video_screening_question;
module.exports.var_video_screening_candidates = video_screening_candidates;