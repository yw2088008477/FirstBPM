/**
 * Created by wankang on 2017/1/6.
 */
/* Setup Layout Part - Sidebar */
angular.module('MaterialApp')
    .controller('PageHeadController', ['$scope', function ($scope) {
        $scope.$on('$includeContentLoaded', function () {
            Demo.init(); // init theme panel
        });
    }]);