'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;

		$scope.menu = [{
            title: 'Облак',
            link: 'storage',
            uiRoute: '/storage'
        }, {
            title: 'Проекти',
            link: 'projects',
            uiRoute: '/projects'
        }, {
            title: 'Редактор',
            link: 'editor',
            uiRoute: '/editor'
        }
        ];

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};
	}
]);