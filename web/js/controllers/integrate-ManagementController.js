// 综合管理部流程中会议需求审批和维修申请流程Controller
angular.module('MaterialApp')
    .controller('IntegrateManagementCtrl',['$rootScope','$scope','$state','$stateParams','$timeout','attachOperation','processDetailFactory',function( $rootScope, $scope, $state, $stateParams, $timeout, attachOperation, processDetailFactory) {
        var modelId = 0;
        var taskId = 0;
        var modelDetails = [];
        var isUpdate = false;
        $scope.formId = "";
        $scope.isStart = true;
        $scope.orderTitle = "";
        $scope.orderModelId = "";
        $scope.processVeriables= {};
        $scope.taskDetails = {};

        if(typeof $stateParams.processModelId !='undefined')
            modelId = $stateParams.processModelId;
        if(typeof $stateParams.taskId !='undefined')
            taskId = $stateParams.taskId;

        var currentUser = $rootScope.userInfo;

        // 流程未发起页面，给一些变量赋初始值，并且赋予附件上传功能的所有权限
        if(modelId!=0) {
            processDetailFactory.getProcessModelDetails(modelId);
            $scope.$on('processModelDetailserviceUpdata',function (event,req) {
                modelDetails=req.data;
                $scope.orderTitle = formatShowName(modelDetails.name);
                $scope.orderModelId = modelId;
                angular.forEach(modelDetails.processVar,function (item) {
                    $scope.processVeriables[item.varKey] = "";
                    if(item.varKey=="applyDate")
                        $scope.processVeriables[item.varKey] = mini.formatDate(new Date(),'yyyy-MM-dd HH:mm:ss');
                    if(item.varKey=="agreeDate")
                        $scope.processVeriables[item.varKey] = mini.formatDate(new Date(),'yyyy-MM-dd HH:mm:ss');
                    if(item.varKey=="applicant")
                        $scope.processVeriables[item.varKey] = currentUser.userName;
                });
            });
            attachOperation.hasNew = true;
            attachOperation.hasModify = true;
            attachOperation.hasRemove = true;
            attachOperation.hasView = true;
            $scope.fileList = [];
        }

        // 流程已发起页面，对于表单页面信息填写权限的判断
        if(taskId!=0) {
            processDetailFactory.gettaskDetails(taskId);
            $scope.$on("taskDetailserviceUpdata", function (event,req) {
                $scope.taskDetails = req.data;
                $scope.$parent.acceptTask(taskId, $scope.taskDetails.status);
                processDetailFactory.getProcessDetails($scope.taskDetails.processId);
                $scope.$on("processDetailserviceUpdata", function (event, req) {
                    $scope.processDetails = req.data;
                    $scope.orderTitle = formatShowName($scope.processDetails.processModelName);
                    $scope.orderModelId = $scope.processDetails.processModelId;
                    if ($scope.taskDetails.status == 2) {
                        processDetailFactory.getActiveVariables(taskId, 'task');
                    } else {
                        processDetailFactory.getActiveVariables($scope.taskDetails.processId, 'process');
                    }
                    $scope.$on("activeVariableUpdata", function (event, req) {
                        $scope.processVeriables = req.data;
                        $scope.fileList = angular.fromJson($scope.processVeriables.files);
                        $scope.$broadcast('filesUpdate', $scope.fileList);
                    })

                })
                processDetailFactory.getProcessnotes($scope.taskDetails.processId);
                $scope.$on("notesServiceUpdata", function (event, req) {
                    $scope.notes = req.data;
                })
                $scope.isStart = false;
                if ($scope.taskDetails.display != "申请人") {
                    $scope.processVeriables.orderStatus = $scope.taskDetails.display;
                }
                else {
                    $scope.isStart = true;
                    isUpdate = true;
                }
                if ($scope.taskDetails.display == "经办人") {
                    isUpdate = true;
                }
                if ($scope.taskDetails.status == 2 || ($scope.taskDetails.display != "申请人" && $scope.taskDetails.display != "经办人")) {
                    attachOperation.hasNew = false;
                    attachOperation.hasModify = false;
                    attachOperation.hasRemove = false;
                    attachOperation.hasView = true;
                }
                else {
                    attachOperation.hasNew = true;
                    attachOperation.hasModify = true;
                    attachOperation.hasRemove = true;
                    attachOperation.hasView = true;
                }
                if ($scope.taskDetails.status == 2)
                    angular.element(".first-footer").hide();
            })
        }

        // 监听附件信息
        $scope.$on('filesUpdate',function (event,rep) {
            $scope.fileList = rep;
        });

        // 表单字段及相应按钮是否显示
        $scope.isShow = function(field){
            if(taskId!=0) {
                if ($scope.taskDetails.status != 2) {
                    if (field == "address" || field == "budget" || field == "content" || field == "plan" ||field == "meetingName"
                        || field == "startDate" || field == "endDate" || field == "meetingAdd" ||field == "meetingMP" || field == "remark"
                    ) {

                        if ($scope.taskDetails.display=="申请人") {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }

                    if(field == "btn" || field == "btn1" || field == "note"){
                        if($scope.taskDetails.display=="申请人"){
                            return true;
                        }
                        else if($scope.taskDetails.display=="复核人"){
                            if(field == "btn1"){
                                return true;
                            }
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
                if (field == "address" || field == "budget" || field == "content" || field == "plan" ||field == "btn2" ||field == "meetingName"
                    || field == "startDate" || field == "endDate" || field == "meetingAdd" ||field == "meetingMP" || field == "remark" ) {
                    return false;
                }
                else
                    return true;
            }
        }

        // 表单底部提交按钮方的法判断
        $scope.submit =function(type){
            $scope.processVeriables.submitFlag = type;
            console.log($scope.processVeriables);
            $scope.processVeriables.meetingMP=parseFloat($scope.processVeriables.meetingMP);
            $scope.processVeriables.files = $scope.$parent.getFiles($scope.fileList);
            if($scope.isStart && !isUpdate) {
                if($scope.orderModelId == 3157 && $scope.processVeriables.budget != "" && $scope.processVeriables.content != ""
                ||$scope.orderModelId == 3156 && $scope.processVeriables.meetingAdd != "" && $scope.processVeriables.meetingMP != ""
                ) {
                    $scope.$parent.submitVeriables(modelDetails.uuid, {formData: angular.toJson($scope.processVeriables)});
                }
                else {
                    bootbox.alert({message:'请填写必填（带红色*）项的内容', size:'small'});
                }
            }
            else {
                $scope.$parent.updateVeriables($scope.taskDetails.processId, taskId,{formData: angular.toJson($scope.processVeriables)}, type);
            }
        }
    }])