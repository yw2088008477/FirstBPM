// 用印流程通用controller
angular.module('MaterialApp')
    .controller('SealContractCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', 'attachOperation', 'processDetailFactory', 'baseServices', function ($rootScope, $scope, $state, $stateParams, $timeout, attachOperation,processDetailFactory, baseServices) {
        var modelId = 0;
        var taskId = 0;
        var modelDetails = [];
        var isUpdate = false;
        var checkFlag = false;
        $scope.formId = "";
        $scope.isStart = true;
        $scope.orderTitle = "";
        $scope.orderModelId = "";
        $scope.processVeriables = {};
        $scope.taskDetails = {};

        if (typeof $stateParams.processModelId != 'undefined')
            modelId = $stateParams.processModelId;
        if (typeof $stateParams.taskId != 'undefined')
            taskId = $stateParams.taskId;

        // 获取所有印章信息
        baseServices.postPromise('query/getAssetCategoryAll', {type: "SEALTYPE"}).then(function (data) {
            $scope.sealType = data;
        }, function (err) {
            console.log(err);
        });

        var currentUser = $rootScope.userInfo;

        // 流程未发起页面，给一些变量赋初始值，并且赋予附件上传功能的所有权限
        if (modelId != 0) {
            processDetailFactory.getProcessModelDetails(modelId);
            $scope.$on('processModelDetailserviceUpdata', function (event, req) {
                modelDetails = req.data;
                $scope.orderTitle = formatShowName(modelDetails.name);
                $scope.orderModelId = modelId;
                angular.forEach(modelDetails.processVar, function (item) {
                    $scope.processVeriables[item.varKey] = "";
                    if (item.varKey == "applicant")
                        $scope.processVeriables[item.varKey] = currentUser.userName;
                    if (item.varKey == "applyDate")
                        $scope.processVeriables[item.varKey] = mini.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    if (item.varKey == "isApprove") {
                        $scope.processVeriables[item.varKey] = "是";
                    }
                    if (item.varKey == "sealNum") {
                        $scope.processVeriables[item.varKey] = {};
                    }
                });
            })
            attachOperation.hasNew = true;
            attachOperation.hasModify = true;
            attachOperation.hasRemove = true;
            attachOperation.hasView = true;
            $scope.fileList = [];
        }

        // 流程已发起页面，对于表单页面信息填写权限的判断
        if (taskId != 0) {
            processDetailFactory.gettaskDetails(taskId);
            $scope.$on("taskDetailserviceUpdata", function (event, req) {
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
                        if ($scope.processVeriables.sealType)
                            $scope.processVeriables.sealType = angular.fromJson($scope.processVeriables.sealType);
                        if ($scope.processVeriables.sealNum)
                            $scope.processVeriables.sealNum = angular.fromJson($scope.processVeriables.sealNum);
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
                if ($scope.orderModelId == 3180) {
                    attachOperation.hasNew = false;
                    attachOperation.hasModify = false;
                    attachOperation.hasRemove = false;
                    attachOperation.hasView = false;
                }
                if ($scope.taskDetails.display == "用印负责人") {
                    attachOperation.hasDownload = true;
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
            })


        }

        // 将被选中的用印类型赋值给用印数量
        $scope.ckchange = function (item) {
            $scope.processVeriables.sealNum[item] = $scope.processVeriables.sealType[item];
        }

        $scope.$on('filesUpdate', function (event, rep) {
            $scope.fileList = rep;
        });

        // 表单字段及相应按钮是否显示
        $scope.isShow = function (field) {
            if (taskId != 0) {
                if ($scope.taskDetails.status != 2) {
                    if (field == "fileName" || field == "applyDept" || field == "applicant" || field == "applyDate"
                        || field == "fileNum" || field == "contractNO" || field == "sendUnit" || field == "sealNum" ||
                        field == "sealType" || field == "isApprove" || field == "remark" || field == "files") {

                        if ($scope.taskDetails.display == "申请人") {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }

                    if (field == "btn" || field == "btn1" || field == "note") {
                        if ($scope.taskDetails.display == "申请人" || $scope.orderModelId == 3393 && $scope.taskDetails.display == "合规部经办人") {
                            return true;
                        }
                        else if ($scope.taskDetails.display == "复核人") {
                            if (field == "btn1") {
                                return true;
                            }
                        }
                        else
                            return false;
                    }

                    if (field == "btn2") {
                        return false;
                    }
                }
                else
                    return true;
            }
            else {
                if (field == "fileName" || field == "applyDept" || field == "applicant" || field == "applyDate"
                    || field == "fileNum" || field == "contractNO" || field == "sendUnit" || field == "sealNum" || field == "sealType" ||
                    field == "isApprove" || field == "remark" || field == "files" || field == "btn2") {
                    return false;
                }
                else
                    return true;
            }
        }

// 表单底部提交按钮方的法判断
        $scope.submit = function (type) {
            // 根据提交按钮的方法里边的参数给submitFlag赋值，然后根据不同的submitFlag来决定流程的走向
            $scope.processVeriables.submitFlag = type;
            $scope.processVeriables.files = $scope.$parent.getFiles($scope.fileList);
            $scope.processVeriables.fileNum = parseFloat($scope.processVeriables.fileNum);

            // 用印是否选择判断
            angular.forEach($scope.sealType, function (item) {
                console.log(item);
                if ($scope.processVeriables.sealType[item.CATEGORY_NAME])
                    if ($scope.processVeriables.sealType[item.CATEGORY_NAME] == '1')
                        checkFlag = true;
            });

            if ($scope.isStart && !isUpdate) {
                if ($scope.processVeriables.fileName != "") {
                    if ($scope.orderModelId != 3180 && $scope.processVeriables.files.length < 1) {
                        bootbox.alert({message: '请上传需要用印的文件', size: 'small'});
                        return;
                    }
                    if (!checkFlag) {
                        bootbox.alert({message: '请选择相应的印章', size: 'small'});
                        return;
                    }
                    $scope.$parent.submitVeriables(modelDetails.uuid, {formData: angular.toJson($scope.processVeriables)});
                }
                else {
                    bootbox.alert({message: '请填写必填（带红色*）项的内容', size: 'small'});
                }
            }
            else {
                $scope.$parent.updateVeriables($scope.taskDetails.processId, taskId, {formData: angular.toJson($scope.processVeriables)}, type);
            }
        }

    }])