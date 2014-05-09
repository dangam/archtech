'use strict';

// Setting up route
angular.module('editor').config(['$stateProvider',
    function($stateProvider) {
        // Editor state routing
        $stateProvider.
            state('openEditor', {
                url: '/editor',
                templateUrl: 'modules/editor/views/index.html'
            }).
            state('fileEditor', {
                url: '/editor/file/:fileId',
                templateUrl: 'modules/editor/views/editor.html'
            });
    }
]);