angular.module('MaterialApp').controller('ProcessPrintCtrl',['$scope','$state','$stateParams','$timeout',function ($scope,$state,$stateParams,$timeout) {
    var taskId = 0;
    $scope.orderTitle = "";
    $scope.orderModelId = "";
    $scope.processVeriables= {};

    if(typeof $stateParams.taskId !='undefined')
        taskId = $stateParams.taskId;
    if(taskId!=0) {
        $scope.taskDetails = query('GM_gettaskdetails',{taskId:taskId})[0];
        $scope.processDetails = query('GM_getprocessdetails',{processId: $scope.taskDetails.processId})[0];
        $scope.orderTitle = formatShowName($scope.processDetails.processModelName);
        $scope.orderModelId = $scope.processDetails.processModelId;
        $scope.processVeriables = query('getprocessvariables',{id: $scope.taskDetails.processId})[0];
        if($scope.orderModelId == 3151) {
            $scope.tradeTypeList = [
                {id:'1',text:"买卖债券",type:'base'},{id:'2',text:"银行存款",type:'base'},{id:'3',text:"销售资管产品",type:'base'},
                {id:'4',text:"投资资管产品",type:'base'},{id:'5',text:"债券回购",type:'base'},{id:'6',text:"信托计划",type:'base'},
                {id:'7',text:"销售债权计划",type:'base'},{id:'8',text:"投资债权计划",type:'base'},{id:'9',text:"涉及关联方基础资产的金融产品",type:'long'},
                {id:'10',text:"证券投资基金",type:'base'},{id:'11',text:"其它",type:'long'}];
            $scope.processVeriables.tradeType = angular.fromJson($scope.processVeriables.tradeType);
        }
    }
}]);