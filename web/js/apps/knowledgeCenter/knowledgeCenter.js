angular.module('MaterialApp').controller('knowledgeCenterCtr',['$rootScope','$scope',function($rootScope, $scope) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    $scope.app.settings.layout.pageBodySolid = true;
    $scope.app.settings.layout.pageSidebarClosed = true;

}]);




