angular.module('MaterialApp').controller('sendMessageDetailCtrl', ['$scope', '$stateParams',function ($scope, $stateParams) {

    var attribute = $stateParams.attribute;
    console.log(attribute);

    $scope.attribute = attribute;

}]);