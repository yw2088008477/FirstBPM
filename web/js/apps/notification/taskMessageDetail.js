angular.module('MaterialApp').controller('taskMessageDetailCtrl', ['$scope', '$stateParams',function ($scope, $stateParams) {

    var attribute = $stateParams.attribute;
    console.log(attribute);

    $scope.attribute = attribute;

}]);