'use strict';

angular.module('editor').controller('EditorController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Projects',
    function($scope, $stateParams, $location, $http, Authentication, Projects){

        $scope.init = function(){
            console.log('Editor things');
        };

        $scope.home = function(){
            console.log('Do smthing');
        };

        Projects.query(function(projects) {
            $scope.projects = projects;
        });
    }
]);