/**
 * Created by wankang on 2017/1/7.
 */
/* Setup Layout Part - Footer */
angular.module('MaterialApp')
    .controller('FooterController', ['$scope', function ($scope) {
        $scope.$on('$includeContentLoaded', function () {
            Layout.initFooter(); // init footer
        });
    }]);