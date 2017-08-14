/**
 * Created by wankang on 2017/1/6.
 */
/* Setup Layout Part - Quick Sidebar */
angular.module('MaterialApp')
    .controller('QuickSidebarController', ['$scope', function ($scope) {
        $scope.$on('$includeContentLoaded', function () {
            setTimeout(function () {
                QuickSidebar.init(); // init quick sidebar
            }, 2000)
        });
    }]);