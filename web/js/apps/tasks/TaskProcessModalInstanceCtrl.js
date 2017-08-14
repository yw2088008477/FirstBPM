angular.module('MaterialApp').controller('TaskProcessModalInstanceCtrl', ['$scope', '$uibModalInstance','$state', function($scope, $uibModalInstance,$state) {

    $scope.ok = function () {
        var selectUsers = mini.get("userAndGroup").getValue();
        var users=selectUsers.replaceAll(",",";");
        var processId = $("#taskProcessId").val();
        setProcessSecurityRole(processId,users)
        $uibModalInstance.close();
        setTimeout(function(){
            $state.reload();
        }, 500);

    }
    $scope.cancel = function () {
        $uibModalInstance.close();
    };
}]);