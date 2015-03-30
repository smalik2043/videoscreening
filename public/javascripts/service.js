/**
 * Created with JetBrains WebStorm.
 * User: Sulaiman
 * Date: 3/7/15
 * Time: 12:39 AM
 * To change this template use File | Settings | File Templates.
 */

var videoScreeningApp = angular.module('videoScreeningApp',['ngRoute']);

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
