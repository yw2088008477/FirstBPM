angular.module('MaterialApp').controller('personalizedMessageDetailCtrl', ['$scope', '$stateParams',function ($scope, $stateParams) {

    var attribute = $stateParams.attribute;
    console.log(attribute);

    $scope.attribute = attribute;

}]);