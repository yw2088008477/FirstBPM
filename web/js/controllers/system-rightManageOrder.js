angular.module('MaterialApp')
    .controller('SystemRightCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', 'attachOperation','processDetailFactory', 'baseServices', function($rootScope, $scope, $state, $stateParams, $timeout, attachOperation,processDetailFactory, baseServices) {
        var modelId = 0;
        var taskId = 0;
        var modelDetails = [];
        var isUpdate = false;
        $scope.formId = "";
        $scope.isStart = true;
        $scope.orderTitle = "";
        $scope.orderModelId = "";
        $scope.processVeriables = {};
        $scope.taskDetails = {};


        function getData(type) {
            return { type: type }
        }

        baseServices.postPromise('query/getAssetCategoryAll', getData("SYSNAME")).then(function(data) {
            $scope.sysNames = data;
        }, function(err) {
            console.log(err);
        });

        if (typeof $stateParams.processModelId != 'undefined')
            modelId = $stateParams.processModelId;
        if (typeof $stateParams.taskId != 'undefined')
            taskId = $stateParams.taskId;

        var currentUser = $rootScope.userInfo;
        if (modelId != 0) {
            processDetailFactory.getProcessModelDetails(modelId);
            $scope.$on('processModelDetailserviceUpdata', function(event, req) {
                modelDetails = req.data;
                $scope.orderTitle = formatShowName(modelDetails.name);
                $scope.orderModelId = modelId;
                angular.forEach(modelDetails.processVar, function(item) {
                    $scope.processVeriables[item.varKey] = "";
                    if (item.varKey == "applyDate")
                        $scope.processVeriables[item.varKey] = mini.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    if (item.varKey == "agreeDate")
                        $scope.processVeriables[item.varKey] = mini.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    if (item.varKey == "applicant")
                        $scope.processVeriables[item.varKey] = currentUser.userName;
                    if (item.varKey == "userName")
                        $scope.processVeriables[item.varKey] = currentUser.firstName;
                    if ($scope.orderModelId == 3171 && item.varKey == "content")
                        $scope.processVeriables[item.varKey] = "系统设置";
                    if ($scope.orderModelId == 3171 && item.varKey == "parameterType")
                        $scope.processVeriables[item.varKey] = "0";
                    if ($scope.orderModelId == 3160 && item.varKey == "applyType")
                        $scope.processVeriables[item.varKey] = "新设";
                    if (item.varKey == "isPurchase")
                        $scope.processVeriables[item.varKey] = "需采购";
                    if (item.varKey == "purchaseStatus")
                        $scope.processVeriables[item.varKey] = "集中采购";
                    if (item.varKey == "isVersion")
                        $scope.processVeriables[item.varKey] = "需版本";
                    if (item.varKey == "versionStatus")
                        $scope.processVeriables[item.varKey] = "需求排期";
                    if (item.varKey == "reqStatus")
                        $scope.processVeriables[item.varKey] = "进行中";
                    if (item.varKey == "sysName")
                        $scope.processVeriables[item.varKey] = "TA";
                });
            })
            attachOperation.hasNew = true;
            attachOperation.hasModify = true;
            attachOperation.hasRemove = true;
            attachOperation.hasView = true;
            $scope.fileList = [];

        }
        if (taskId != 0) {
            processDetailFactory.gettaskDetails(taskId);
            $scope.$on("taskDetailserviceUpdata", function(event, data) {
                $scope.taskDetails = data.data;
                $scope.$parent.acceptTask(taskId, $scope.taskDetails.status);
                processDetailFactory.getProcessDetails($scope.taskDetails.processId);
                $scope.$on("processDetailserviceUpdata", function(event, data) {
                    $scope.processDetails = data.data;
                    $scope.orderTitle = formatShowName($scope.processDetails.processModelName);
                    $scope.orderModelId = $scope.processDetails.processModelId;
                    processDetailFactory.getActiveVariables($scope.taskDetails.status == 2 ? taskId : $scope.taskDetails.processId, $scope.taskDetails.status == 2 ? 'task' : 'process');
                    $scope.$on('activeVariableUpdata', function(event, req) {
                        $scope.processVeriables = req.data;
                        $scope.fileList = angular.fromJson($scope.processVeriables.files);
                        $scope.$broadcast('filesUpdate', $scope.fileList);

                        if ($scope.taskDetails.display != "申请人") {
                            $scope.processVeriables.orderStatus = $scope.taskDetails.display;
                        } else {
                            $scope.isStart = true;
                            isUpdate = true;
                        }
                    });
                    $scope.notes = query("getprocessnotes", { id: $scope.taskDetails.processId });
                });
                $scope.isStart = false;
                processDetailFactory.getProcessnotes($scope.taskDetails.processId);
                $scope.$on('notesServiceUpdata', function(event, req) {
                    $scope.notes = req.data;
                });
                if ($scope.taskDetails.display == "经办人") {
                    isUpdate = true;
                }
                if ($scope.taskDetails.status == 2 || ($scope.taskDetails.display != "申请人" && $scope.taskDetails.display != "经办人")) {
                    attachOperation.hasNew = false;
                    attachOperation.hasModify = false;
                    attachOperation.hasRemove = false;
                    attachOperation.hasView = true;
                } else {
                    attachOperation.hasNew = true;
                    attachOperation.hasModify = true;
                    attachOperation.hasRemove = true;
                    attachOperation.hasView = true;
                }
            })
        }


        $scope.$on('filesUpdate', function(event, rep) {
            $scope.fileList = rep;
        })

        $scope.isShow = function(field) {
            if (taskId != 0) {
                if ($scope.taskDetails.status != 2) {
                    if (field == "permission" || field == "sysName" || field == "usrName" || field == "applyReason" || field == "applyType" || field == "agreeDate" || field == "title" || field == "content" || field == "parameterType" || field == "isPurchase" || field == "purchaseStatus" || field == "isVersion" || field == "versionStatus" || field == "reqStatus") {

                        if ($scope.taskDetails.display == "申请人") {
                            return false;
                        } else {
                            return true;
                        }
                    }

                    if (field == "btn" || field == "btn1" || field == "note") {
                        if ($scope.orderModelId == 3171 && $scope.taskDetails.display == "负责人" || $scope.taskDetails.display == "申请人" || $scope.taskDetails.display == "经办人" || $scope.orderModelId == 3177 && $scope.taskDetails.display == "032经办人" || $scope.orderModelId == 3177 && $scope.taskDetails.display == "EAI经办人") {
                            return true;
                        } else if ($scope.taskDetails.display == "复核人" || $scope.orderModelId == 3186 && $scope.taskDetails.display == "申请人") {
                            if (field == "btn1") {
                                return true;
                            }
                        } else
                            return false;
                    }

                    if (field == "btn2") {
                        return false;
                    }
                } else
                    return true;
            } else {
                if (field == "permission" || field == "sysName" || field == "usrName" || field == "applyReason" || field == "applyType" || field == "agreeDate" || field == "title" || field == "content" || field == "parameterType" || field == "isPurchase" || field == "purchaseStatus" || field == "isVersion" || field == "versionStatus" || field == "reqStatus" || field == "btn2") {
                    return false;
                } else
                    return true;
            }
        }


        $scope.submit = function(type) {
            $scope.processVeriables.submitFlag = type;
            $scope.processVeriables.files = $scope.$parent.getFiles($scope.fileList);
            if ($scope.isStart && !isUpdate) {
                if ($scope.orderModelId == 3160 && $scope.processVeriables.sysName != "" && $scope.processVeriables.applyType != "" && $scope.processVeriables.permission != "" || $scope.orderModelId == 3171 && $scope.processVeriables.applyReason != "" || $scope.orderModelId == 3177 && $scope.processVeriables.title != "" && $scope.processVeriables.content != "" ||
                    $scope.orderModelId == 3186 && $scope.processVeriables.isPurchase != "" && $scope.processVeriables.isVersion != "" && $scope.processVeriables.reqStatus != "") {
                    $scope.$parent.submitVeriables(modelDetails.uuid, { formData: angular.toJson($scope.processVeriables) });
                } else {
                    bootbox.alert({ message: '请填写必填（带红色*）项的内容', size: 'small' });
                }
            } else {
                $scope.$parent.updateVeriables($scope.taskDetails.processId, taskId, { formData: angular.toJson($scope.processVeriables) }, type);
            }

        }

    }])
