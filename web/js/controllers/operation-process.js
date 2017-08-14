angular.module('MaterialApp')
    .controller('OperationCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', 'attachOperation', 'processDetailFactory','baseServices', function($rootScope, $scope, $state, $stateParams, $timeout, attachOperation, processDetailFactory,baseServices) {
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

        baseServices.postPromise('query/getAssetCategoryAll', getData("TA")).then(function(data) {
            $scope.TAParameters = data;
        }, function(err) {
            console.log(err);
        });

        baseServices.postPromise('query/getAssetCategoryAll', getData("O32")).then(function(data) {
            $scope.O32Parameters = data;
        }, function(err) {
            console.log(err);
        });

        baseServices.postPromise('query/getAssetCategoryAll', getData("GP3")).then(function(data) {
            $scope.GP3Parameters = data;
        }, function(err) {
            console.log(err);
        });
        baseServices.postPromise('query/getAssetCategoryAll', getData("M5")).then(function(data) {
            $scope.M5Parameters = data;
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
                        if ($scope.processVeriables.p_TA) {
                            $scope.processVeriables.p_TA = angular.fromJson($scope.processVeriables.p_TA);
                        }
                        if ($scope.processVeriables.p_O32) {
                            $scope.processVeriables.p_O32p_O32 = angular.fromJson($scope.processVeriables.p_O32);
                        }
                        if ($scope.processVeriables.p_GP3) {
                            $scope.processVeriables.p_GP3 = angular.fromJson($scope.processVeriables.p_GP3);
                        }
                        if ($scope.processVeriables.M5) {
                            $scope.processVeriables.M5 = angular.fromJson($scope.processVeriables.M5);
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
                    if (field == "content" || field == "title" || field == "p_TA" || field == "p_O32" || field == "p_GP3" || field == "p_M5" || field == "tradeType") {

                        if ($scope.taskDetails.display == "申请人" || $scope.taskDetails.display == "营运部TA岗" || $scope.taskDetails.display == "营运部交易岗" || $scope.taskDetails.display == "营运部估值岗GP3" ||
                            $scope.taskDetails.display == "营运部估值岗M5") {
                            return false;
                        } else {
                            return true;
                        }
                    }

                    if (field == "btn" || field == "btn1" || field == "note") {
                        if ($scope.taskDetails.display == "申请人" || $scope.taskDetails.display == "经办人") {
                            return true;
                        } else if ($scope.taskDetails.display == "复核人") {
                            if (field == "btn1") {
                                return true;
                            }
                        } else if ($scope.orderModelId == 3184 && $scope.taskDetails.display == "营运部TA岗" ||
                            $scope.orderModelId == 3184 && $scope.taskDetails.display == "营运部交易岗" ||
                            $scope.orderModelId == 3184 && $scope.taskDetails.display == "营运部估值岗GP3" ||
                            $scope.orderModelId == 3184 && $scope.taskDetails.display == "营运部估值岗M5") {
                            if (field == "btn") {
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
                if (field == "content" || field == "title" || field == "p_TA" || field == "p_O32" || field == "p_GP3" || field == "p_M5" || field == "btn2" || field == "tradeType") {
                    return false;
                } else
                    return true;
            }
        }


        $scope.submit = function(type) {
            $scope.processVeriables.submitFlag = type;
            $scope.processVeriables.attachment = $scope.$parent.getFiles($scope.fileList);
            if ($scope.isStart && !isUpdate) {
                if ($scope.orderModelId == 3181 && $scope.processVeriables.content == "") {
                    bootbox.alert({ message: '请填写必填（带红色*）项的内容', size: 'small' });
                } else {
                    $scope.$parent.submitVeriables(modelDetails.uuid, { formData: angular.toJson($scope.processVeriables) });
                }
            } else {
                $scope.$parent.updateVeriables($scope.taskDetails.processId, taskId, { formData: angular.toJson($scope.processVeriables) }, type);
            }

        }

    }])
