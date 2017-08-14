/**
 * Created by wankang on 2017/1/7.
 */
angular.module('MaterialApp')
    .controller('UserProfileController', function ($rootScope, $scope, $http, $timeout) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
            Layout.setMainMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu
        });

        // set sidebar closed and body solid layout mode
        $scope.app.settings.layout.pageBodySolid = true;
        $scope.app.settings.layout.pageSidebarClosed = true;
    });
