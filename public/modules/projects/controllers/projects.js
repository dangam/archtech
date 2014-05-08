'use strict';

angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Projects', 'ProjectsStorage',
    function($scope, $stateParams, $location, $http, Authentication, Projects, ProjectsStorage){

        $scope.authentication = Authentication;
        $scope.users = [];
        $scope.selectedUser = '';
        $scope.sortFilesBy = 'type';
        $scope.selected = '';
        $scope.dir = '0';
        $scope.storageDir = '0';
        $scope.path = [];


        $scope.create = function() {
            var project = new Projects({
                title: this.title,
                content: this.content
            });
            project.$save(function(response) {
                $location.path('projects/' + response._id);
            });

            this.title = '';
            this.content = '';
        };

        $scope.remove = function(project) {
            if (project) {
                project.$remove();

                for (var i in $scope.projects) {
                    if ($scope.projects[i] === project) {
                        $scope.projects.splice(i, 1);
                    }
                }
            } else {
                $scope.project.$remove(function() {
                    $location.path('projects');
                });
            }
        };

        $scope.update = function() {
            var project = $scope.project;
            if (!project.updated) {
                project.updated = [];
            }
            project.updated.push(new Date().getTime());

            project.$update(function() {
                $location.path('projects/' + project._id);
            });
        };

        $scope.find = function() {
            Projects.query(function(projects) {
                $scope.projects = projects;
            });
        };

        $scope.findOne = function() {
            Projects.get({
                projectId: $stateParams.projectId
            }, function(project) {
                $scope.project = project;
            });

            ProjectsStorage.init({
                projectId: $stateParams.projectId
            }, function(files) {
                $scope.storage = files;
            });
        };

        $scope.refreshFolder = function(){
            $scope.storage = ProjectsStorage.openFolder({ projectId: $stateParams.projectId, inFolder: $scope.dir });
        };

        $scope.findUser = function(){
            if($scope.memberName !== undefined){
                $http.post('/users/find', { name: $scope.memberName }).success(function(response){
                    $scope.users = response;
                }).error(function(response) {
                    $scope.error = response.message;
                });
            } else {
                $scope.users = [];
            }
        };

        $scope.selectUser = function(){
            $scope.selectedUser = this.user._id;
        };

        $scope.addMember = function(){
            if($scope.selectedUser !== ''){
                $http.post('/projects/add-member', { id: $stateParams.projectId, user: $scope.selectedUser }).success(function(response){
                    $scope.project.members = response;
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }
        };
        $scope.deleteMember = function(){
            $http.post('/projects/delete-member', { id: $stateParams.projectId, user: this.member.id }).success(function(response){
                $scope.project.members = response;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };


        /* Project Storage Methods */


        $scope.storageCreate = function() {
            var storage = {
                name: this.folderName,
                realName: this.folderName,
                fileType: 'Папка',
                size: '',
                inFolder: $scope.dir,
                user: Authentication.user._id,
                project: $stateParams.projectId,
                type: 1,
                active: 1
            };

            $http.post('projects/'+$stateParams.projectId+'/storage', storage).success(function(res){
                $scope.storage = ProjectsStorage.openFolder({ projectId: $stateParams.projectId, inFolder: $scope.dir });
                angular.element('#create-folder-modal').modal('hide');
            }).error(function(response) {
                $scope.error = response.message;
            });

            this.folderName = '';
        };

        $scope.storageChangeSelected = function(){
            $scope.selected = this.file._id;
        };

        $scope.storageDelete = function(){
            if($scope.selected !== '') {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/projects/'+$stateParams.projectId+'/storage/remove/'+$scope.selected);
                xhr.send($scope.selected);
                $scope.storage = ProjectsStorage.openFolder({
                    projectId: $stateParams.projectId,
                    inFolder: $scope.dir
                });
            }
        };

        $scope.storageOpen = function(){
            if($scope.selected !== '') {
                $scope.storage = ProjectsStorage.openFolder({
                    projectId: $stateParams.projectId,
                    inFolder: $scope.selected
                });
                $scope.dir = $scope.selected;
                $scope.storageDir = $scope.selected;
                $scope.path.push({
                    name: angular.element('#storage-file-' + $scope.selected).data('name'),
                    id: $scope.selected
                });
                $scope.selected = '';
            }
        };

        $scope.storageBack = function(){
            if($scope.path.length >= 2){
                var backDir = $scope.path[$scope.path.length - 2];
                $scope.storage = ProjectsStorage.openFolder({ projectId: $stateParams.projectId, inFolder: backDir.id });
                $scope.dir = $scope.selected;
                $scope.storageDir = $scope.selected;
                $scope.path.splice($scope.path.length - 1, 1);
            } else {
                $scope.storage = ProjectsStorage.openFolder({ projectId: $stateParams.projectId, inFolder: '0' });
                $scope.dir = '0';
                $scope.storageDir = '0';
                $scope.path = [];
            }
            $scope.selected = '';
        };
    }
]);