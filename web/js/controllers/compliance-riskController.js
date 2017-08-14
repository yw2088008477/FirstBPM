angular.module('MaterialApp')
    .controller('CompRiskCtrl',['$rootScope','$scope','$state','$stateParams','$timeout','attachOperation','processDetailFactory',function( $rootScope, $scope, $state, $stateParams, $timeout, attachOperation,processDetailFactory) {
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
        $scope.tradeTypeList = [
            {id:'1',text:"买卖债券",type:'base'},{id:'2',text:"银行存款",type:'base'},{id:'3',text:"销售资管产品",type:'base'},
            {id:'4',text:"投资资管产品",type:'base'},{id:'5',text:"债券回购",type:'base'},{id:'6',text:"信托计划",type:'base'},
            {id:'7',text:"销售债权计划",type:'base'},{id:'8',text:"投资债权计划",type:'base'},{id:'9',text:"涉及关联方基础资产的金融产品",type:'long'},
            {id:'10',text:"证券投资基金",type:'base'},{id:'11',text:"其它",type:'long'}];

        if(typeof $stateParams.processModelId !='undefined')
            modelId = $stateParams.processModelId;
        if(typeof $stateParams.taskId !='undefined')
            taskId = $stateParams.taskId;

        var currentUser = $rootScope.userInfo;
        if(modelId!=0) {
            processDetailFactory.getProcessModelDetails(modelId);
            $scope.$on('processModelDetailserviceUpdata',function (event,req) {
                modelDetails = req.data;
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
            })
            attachOperation.hasNew = true;
            attachOperation.hasModify = true;
            attachOperation.hasRemove = true;
            attachOperation.hasView = true;
            $scope.fileList = [];
        }
        if(taskId!=0) {
            $scope.isStart = false;
            processDetailFactory.gettaskDetails(taskId);
            $scope.$on('taskDetailserviceUpdata',function (event,req) {
                $scope.taskDetails = req.data;
                $scope.$parent.acceptTask(taskId, $scope.taskDetails.status);
                processDetailFactory.getProcessDetails($scope.taskDetails.processId);
                $scope.$on('processDetailserviceUpdata',function (event,req) {
                    $scope.processDetails = req.data;
                    $scope.orderTitle = formatShowName($scope.processDetails.processModelName);
                    $scope.orderModelId = $scope.processDetails.processModelId;
                    processDetailFactory.getActiveVariables($scope.taskDetails.status==2?taskId:$scope.taskDetails.processId,$scope.taskDetails.status==2?'task':'process');
                    $scope.$on('activeVariableUpdata',function (event,req) {
                        $scope.processVeriables = req.data;
                        $scope.fileList = angular.fromJson($scope.processVeriables.files);
                        $scope.$broadcast('filesUpdate',$scope.fileList);
                        if($scope.orderModelId == 3151) {
                            $scope.processVeriables.tradeType = angular.fromJson($scope.processVeriables.tradeType);
                        }

                        if($scope.taskDetails.display!="申请人") {
                            $scope.processVeriables.orderStatus = $scope.taskDetails.display;
                        }
                        else {
                            $scope.isStart = true;
                            isUpdate = true;
                        }
                    });

                    $scope.notes = query("getprocessnotes", {id: $scope.taskDetails.processId});
                });
                processDetailFactory.getProcessnotes($scope.taskDetails.processId);
                $scope.$on('notesServiceUpdata',function (event,req) {
                    $scope.notes = req.data;
                });
                if($scope.taskDetails.display=="经办人") {
                    isUpdate = true;
                }
                if($scope.taskDetails.status == 2 ||($scope.taskDetails.display!="申请人" && $scope.taskDetails.display!="经办人")){
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
                if($scope.taskDetails.status == 2 )
                    angular.element(".first-footer").hide();
            });
        }

        $scope.isShow = function(field){
            if(taskId!=0) {
                if ($scope.taskDetails.status != 2) {
                    if (field == "applyItem" || field == "tradeType" || field == "fundAccount" || field == "counterparty"
                        || field == "investType" || field == "tradeAmt" || field == "agreeDate" || field == "title"|| field == "content") {

                        if ($scope.taskDetails.display=="申请人") {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }

                    if(field == "btn" || field == "btn1" || field == "note"){
                        if ($scope.taskDetails.display == "申请人" ) {
                            return true;
                        }
                        else if($scope.orderModelId == 3154){
                            if ( ($scope.processVeriables.orderStatus=="经办人" ||$scope.processVeriables.orderStatus=="负责人")
                                && ($scope.taskDetails.display == "经办人" || $scope.taskDetails.display == "负责人")) {
                                if (field == "btn1") {
                                    return true;
                                }
                            }
                            else
                                return false;
                        }else if($scope.orderModelId == 3151){
                                return false;
                        }
                        else {
                            if ($scope.taskDetails.display == "经办人") {
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
                    }

                    if(field == "btn2") {
                        return false;
                    }
                }
                else
                    return true;
            }
            else {
                if (field == "applyItem" || field == "tradeType" || field == "fundAccount" || field == "counterparty"
                    || field == "investType" || field == "tradeAmt" || field == "agreeDate" || field == "title"
                    || field == "content" ||field == "btn2") {
                    return false;
                }
                else
                    return true;
            }
        }

        $scope.$on('filesUpdate',function (event,rep) {
            $scope.fileList = rep;
        });
        
        $scope.submit =function(type){
            $scope.processVeriables.submitFlag = type;
            $scope.processVeriables.files = $scope.$parent.getFiles($scope.fileList);
            if($scope.isStart && !isUpdate) {
                if($scope.orderModelId == 3151 && $scope.processVeriables.tradeType != ""
                    || $scope.orderModelId == 3150 && $scope.processVeriables.applyItem != ""
                    || $scope.orderModelId == 3154 && $scope.processVeriables.title != "" && $scope.processVeriables.content != "") {
                    if ($scope.orderModelId == 3151) {
                        $scope.processVeriables.agreeDate = new Date($scope.processVeriables.agreeDate);
                        if($scope.processVeriables.tradeType["其他"] && $scope.processVeriables.tradeType["values"]=="" ){
                            bootbox.alert({message:'请填写其他关联交易品种', size:'small'});
                            return;
                        }
                    }
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