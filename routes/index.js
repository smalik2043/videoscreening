
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('login', { title: 'VideoScreening-login' });
};

exports.signup = function(req, res){
    res.render('signup', { title: 'VideoScreening - Signup' });
};

exports.adminDashboard = function(req, res){
    res.render('adminDashboard', { title: 'VideoScreening - Admin Dashboard' });
};

exports.viewManagers = function(req,res){
   res.render('viewManagers', {title: 'VideoScreening - View Managers'});
};

exports.uploadVideo = function(req,res){
    res.render('uploadVideo', {title: 'VideoScreening - Upload Video'});
};

exports.forgotPasswordView = function(req,res){
    res.render('forgotPassword', {title: 'VideoScreening - Forgot Password'});
};

exports.resetPasswordView = function(req,res){
    res.render('resetPassword', {title: 'VideoScreening - Reset Password'});
};