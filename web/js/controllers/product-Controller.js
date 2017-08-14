//产品流程通用controller
angular.module('MaterialApp')
    .controller('ProductCtrl',['$rootScope','$scope','$state','$stateParams','$timeout','attachOperation','processDetailFactory',function( $rootScope, $scope, $state, $stateParams, $timeout, attachOperation,processDetailFactory) {

        var taskId = 0;
        var modelDetails = [];
        var isUpdate = false;
        $scope.formId = "";
        $scope.isStart = true;
        $scope.orderTitle = "";
        $scope.orderModelId = "";
        $scope.processVeriables= {};
        $scope.taskDetails = {};

        if(typeof $stateParams.taskId !='undefined') {
            taskId = $stateParams.taskId;
        }

        // 流程已发起页面，对于表单页面信息填写权限的判断
        if(taskId!=0) {
            $scope.isStart = false;
            processDetailFactory.gettaskDetails(taskId);
            $scope.$on("taskDetailserviceUpdata", function (event,req){
                $scope.taskDetails=req.data;
                $scope.$parent.acceptTask(taskId, $scope.taskDetails.status);
                processDetailFactory.getProcessDetails($scope.taskDetails.processId);
                $scope.$on("processDetailserviceUpdata",function (event,req) {
                    $scope.processDetails = req.data;
                    $scope.orderTitle = formatShowName($scope.processDetails.processModelName);
                    $scope.orderModelId = $scope.processDetails.processModelId;
                    if($scope.taskDetails.status==2) {
                        processDetailFactory.getActiveVariables(taskId,'task');
                    }else {
                        processDetailFactory.getActiveVariables($scope.taskDetails.processId,'process');
                    }
                    $scope.$on("activeVariableUpdata",function (event,req) {
                        $scope.processVeriables=req.data;
                        $scope.fileList = angular.fromJson($scope.processVeriables.attachment);
                        $scope.$broadcast('filesUpdate',$scope.fileList);
                    })
                })
                processDetailFactory.getProcessnotes($scope.taskDetails.processId);
                $scope.$on("notesServiceUpdata",function (event,req) {
                    $scope.notes=req.data;
                } );
                if($scope.taskDetails.display!="产品经理") {
                    $scope.processVeriables.orderStatus = $scope.taskDetails.display;
                }

                if($scope.taskDetails.status == 2 ){
                    attachOperation.hasNew = false;
                    attachOperation.hasModify = false;
                    attachOperation.hasRemove = false;
                    attachOperation.hasView = true;
                }
                else {
                    attachOperation.hasNew = false;
                    attachOperation.hasModify = false;
                    attachOperation.hasRemove = false;
                    attachOperation.hasView = true;
                }
            });

        }

        // 监听附件信息
        $scope.$on('filesUpdate',function (event,rep) {
            $scope.fileList = rep;
        });

        // 表单字段及相应按钮是否显示
        $scope.isShow = function(field){
            if(taskId!=0) {
                if ($scope.taskDetails.status != 2) {
                    if (field == "description") {

                        if ($scope.taskDetails.display=="产品经理") {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }

                    if(field == "btn" || field == "btn1" || field == "note"){
                        if($scope.taskDetails.display=="产品经理"){
                            return true;
                        }
                        else
                        return false;
                    }

                    if(field == "btn2") {
                        return false;
                    }
                }
                else
                    return true;
            }
            else {
                if (field == "description"||field == "btn2") {
                    return false;
                }
                else
                    return true;
            }
        }

        // 表单底部提交按钮方的法判断
        $scope.submit =function(type){
            $scope.processVeriables.submitFlag = type;
            $scope.processVeriables.attachment = $scope.$parent.getFiles($scope.fileList);
               $scope.$parent.updateVeriables($scope.taskDetails.processId,taskId,{formData: angular.toJson($scope.processVeriables)}, type);
        }

    }])


// 产品流程时间轴Controller
angular.module('MaterialApp').controller('ProcessDetailsCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$uibModal', '$document','$timeout','processDetailFactory', function($rootScope, $scope, $state, $stateParams, $uibModal, $document,$timeout,processDetailFactory) {
    $scope.animationsEnabled = true;
    $scope.taskId = 0;
    if($stateParams.taskId)
    { $scope.taskId = $stateParams.taskId;}
    $scope.$on("taskDetailserviceUpdata", function (event,req) {
        $scope.taskDetails = req.data;
        processDetailFactory.getProcessDetails($scope.taskDetails.processId);
        $scope.$on("processDetailserviceUpdata", function (event, req) {
            $scope.processDetails = req.data;
        });
        processDetailFactory.getProcessWizardData($scope.taskDetails.processId);
        $scope.$on("wizardserviceUpdata", function (event,req) {
            $scope.processWizardData = req.data[0];
            $scope.wizardList= $scope.processWizardData.wizard;
            $timeout(function () {
                $(".first-timeaxis").css({'width': ($scope.wizardList.length - 1) * 240});
                $("#tooltip").css({
                    'top': '-30px',
                    'left': ($scope.processWizardData.selectIndex) * 240,
                    'margin-left': '-34px'
                });
                baseLeft = ($scope.processWizardData.selectIndex) * 240;
                if (baseWidth < ($scope.wizardList.length - 1) * 240) {
                    if ((baseWidth / 2) < baseLeft) {
                        $(".first-timeaxis-warpper").scrollLeft(baseLeft - (baseWidth / 2));
                    }
                }
            }, 1000);

            $scope.getUsers = function (obj) {
                var result = '';
                if (obj != null) {
                    if (obj[0].hasOwnProperty("assignees")) {
                        angular.forEach(obj[0].assignees, function (item) {
                            if (result != '') {
                                result += ',';
                            }
                            result += item.name;
                        });
                    }
                }
                return result;
            }

            angular.forEach($scope.wizardList, function (item) {
                if (item.id != 0 && item.id != $scope.wizardList.length - 1) {
                    if (item.id == $scope.processWizardData.selectIndex&&$scope.getUsers(item.lanesNodelist[0].taskInfo)!=null) {
                        $scope.processCurrentInfo = {
                            users: $scope.getUsers(item.lanesNodelist[0].taskInfo),
                            status: item.lanesNodelist[0].taskInfo[0].statusName
                        }

                    }

                }


            });
        });
    })
    //$scope.processCurrentInfo = {users:'',date:''}
}]);