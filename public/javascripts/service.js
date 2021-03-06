/**
 * Created with JetBrains WebStorm.
 * User: Sulaiman
 * Date: 3/7/15
 * Time: 12:39 AM
 * To change this template use File | Settings | File Templates.
 */

var videoScreeningApp = angular.module('videoScreeningApp',['ngRoute']);
function ExtractParamsFromURL(){
    this.url = document.URL;
}
ExtractParamsFromURL.prototype.extractParamsByName = function(key) {
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

    var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
    var qs = regex.exec(this.url);
    return qs == null ? "" : qs[1];
}
videoScreeningApp.config(['$routeProvider','$locationProvider',
    function($routeProvider,$locationProvider) {
        $routeProvider.
            when('/adminDashboard', {
                templateUrl: 'adminDashboard',
                controller: 'mainController'
            });
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);
videoScreeningApp.controller('mainController',function($scope,$http,$window){
    $scope.formData = {};
    $scope.signUpFormData = {};
    $scope.addManagerFormData = {};
    $scope.companyProfileFormData = {};
    $scope.forgotPasswordData = {};
    $scope.resetPasswordData = {};
    $scope.ipaddress = config.ipaddress;

    $scope.login = function() {
        $http.post($scope.ipaddress+'/webViewLogin', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $window.location.href = $scope.ipaddress+'/adminDashboard';
            })
            .error(function(data) {
                console.log('Error: ' + data);
                alert(data.result);
            });
    };

    $scope.signup = function() {
        $scope.signUpFormData.role = "1";
        $http.post($scope.ipaddress+'/createAdmin', $scope.signUpFormData)
            .success(function(data) {
                $scope.signUpFormData = {}; // clear the form so our user is ready to enter another
                $window.location.href = $scope.ipaddress;
            })
            .error(function(data) {
                console.log('Error: ' + data);
                alert(data.result);
            });
    };

    $scope.emailForgotPassword = function() {
        $http.post($scope.ipaddress+'/forgotPassword', $scope.forgotPasswordData)
            .success(function(data) {
                $scope.forgotPasswordData = {}; // clear the form so our user is ready to enter another
                $window.alert("A reset password link has been sent to your email account.");
                $window.location.href = $scope.ipaddress;
            })
            .error(function(data) {
                console.log('Error: ' + data);
                alert(data.result);
            });
    };

    $scope.resetPassword = function() {
        var extractParamsFromURL = new ExtractParamsFromURL();
        var uuid = extractParamsFromURL.extractParamsByName('uuid');
        $scope.resetPasswordData.uuid = uuid;
        $http.post($scope.ipaddress+'/resetUserPassword', $scope.resetPasswordData)
            .success(function(data) {
                $scope.resetPasswordData = {}; // clear the form so our user is ready to enter another
                $window.location.href = $scope.ipaddress;
            })
            .error(function(data) {
                console.log('Error: ' + data);
                alert(data.result);
            });
    };

    $scope.saveManager = function() {
        $scope.addManagerFormData.role = "2";
        $http.post($scope.ipaddress+'/addManager', $scope.addManagerFormData)
            .success(function(data) {
                $scope.addManagerFormData = {}; // clear the form so our user is ready to enter another
                alert("Manager Saved");
            })
            .error(function(data) {
                console.log('Error: ' + data);
                alert(data.result);
            });
    };

    $scope.updateCompany = function() {
        $http.post($scope.ipaddress+'/webChangeCompanyName', $scope.companyProfileFormData)
            .success(function(data){
                $scope.companyProfileFormData = {};
                alert(data.result);
            })
            .error(function(data) {
                console.log('Error: ' + data);
                alert(data.result);
            });
    };

    $scope.logout = function() {
        $http.get($scope.ipaddress+'/logout')
            .success(function(data) {
                $window.location.href = $scope.ipaddress;
            })
            .error(function(data) {
                console.log('Error: ' + data);
                alert(data.result);
            });
    };
    /*    $http.get('/api/todos')
     .success(function(data) {
     $scope.todos = data;
     console.log(data);
     })
     .error(function(data) {
     console.log('Error: ' + data);
     });

     // when submitting the add form, send the text to the node API
     $scope.createTodo = function() {
     $http.post('/api/todos', $scope.formData)
     .success(function(data) {
     $scope.formData = {}; // clear the form so our user is ready to enter another
     $scope.todos = data;
     console.log(data);
     })
     .error(function(data) {
     console.log('Error: ' + data);
     });
     };

     // delete a todo after checking it
     $scope.deleteTodo = function(id) {
     $http.delete('/api/todos/' + id)
     .success(function(data) {
     $scope.todos = data;
     console.log(data);
     })
     .error(function(data) {
     console.log('Error: ' + data);
     });
     };*/

});
