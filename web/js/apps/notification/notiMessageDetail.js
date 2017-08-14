angular.module('MaterialApp').controller('NotiMessageDetailCtrl', ['$scope', '$stateParams',function ($scope, $stateParams) {

    var attribute = $stateParams.attribute;
    console.log(attribute);

    $scope.attribute = attribute;


    var notificationId = $stateParams.notificationId;

    $scope.notificationId = notificationId;

}]);
















