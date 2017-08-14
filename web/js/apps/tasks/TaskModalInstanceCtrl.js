
angular.module('MaterialApp')
    .controller('TaskModalInstanceCtrl', ['$scope', '$uibModalInstance','$state', function($scope, $uibModalInstance,$state) {

    $scope.ok = function () {
        var selectUsers = mini.get("userAndGroup").getValue();
        var tasksUsers=selectUsers.replaceAll(",",";");
        if($("#taskId").val()==null){
            var taskIds = $(".taskCheck:checked");
            for(var i=0;i<taskIds.length;i++){
                reassignTask(taskIds.eq(i).val(),tasksUsers)
            }
            $uibModalInstance.close();
            setTimeout(function(){
                $state.reload();
            }, 500);
        }else{
            reassignTask($("#taskId").val(),tasksUsers);
            $uibModalInstance.close();
            setTimeout(function(){
                $state.transitionTo('MetronicApp.task.list',{fold:'-1'});
            }, 500);
        }
    }
    $scope.cancel = function () {
        $uibModalInstance.close();
    };
}])
;
