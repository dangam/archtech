'use strict';

angular.module('editor').controller('EditorController', ['$scope', '$stateParams', '$location', '$http', 'webStorage', 'Authentication', 'Projects',
    function($scope, $stateParams, $location, $http, webStorage, Authentication, Projects){

        $scope.init = function(){
            console.log('Editor things');
        };

        $scope.home = function(){
            Projects.query(function(projects) {
                $scope.projects = projects;
            });
        };

        $scope.openedFiles = webStorage.session.get('openedFiles');

        $scope.openFile = function(){
            $scope.file = null;
            $http.get('/editor/file/' + $stateParams.fileId).success(function(response){
                $scope.file = response;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

    }
]);