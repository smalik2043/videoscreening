
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('login', { title: 'VideoScreening-login' });
};

exports.signup = function(req, res){
    res.render('signup', { title: 'VideoScreening-Signup' });
};

exports.adminDashboard = function(req, res){
    res.render('adminDashboard', { title: 'VideoScreening-Signup' });
};