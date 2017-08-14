angular.module('MaterialApp')
    .controller('TaskProcessDetailAtUserListCtrl', ['$scope', '$uibModalInstance','$state', function($scope, $uibModalInstance,$state) {

        $scope.ok = function (id,name) {
            if($("#at").val().length>0){
                $("#at").val($("#at").val()+","+id);
            }else{
                $("#at").val(id);
            }
            $("#content").val($("#content").val()+""+name+" ");
            $("#content").focus();
            $uibModalInstance.close();
        }
        $scope.cancel = function () {
            $uibModalInstance.close();
        };
    }])
;