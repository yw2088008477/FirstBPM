angular.module('MaterialApp')
    .controller('AssetBuyCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', 'baseServices', 'processDetailFactory', '$uibModal', function($rootScope, $scope, $state, $stateParams, $timeout, baseServices, processDetailFactory, $uibModal) {
        var modelId = 0;
        var taskId = 0;
        var modelDetails = [];
        var isUpdate = false;
        var purchaseTotal = 0;
        $scope.formId = "";
        $scope.isStart = true;
        $scope.selectAll = false;
        $scope.taskDetails = {};
        $scope.processVeriables = {};
        $scope.productApplyInfo = [];
        $scope.productApplyDetail = {};
        $scope.productApplyDetails = [];
        $scope.productApplyDetailsAll = [];
        $scope.productApplyDetailsAfter = [];
        $scope.productPurchaseInfo = [];
        $scope.purchaseInfoDetails = [];
        $scope.purchaseInfoDetail = {};
        $scope.productApplyInfoDetails = [];

        if (typeof $stateParams.processModelId != 'undefined')
            modelId = $stateParams.processModelId;
        if (typeof $stateParams.taskId != 'undefined')
            taskId = $stateParams.taskId;


        var currentUser = $rootScope.userInfo;
        console.log(currentUser);

        function getApplyInfoAll() {
            baseServices.postPromise('query/getApplyInfoAll').then(function(result) {
                if (result.length > 0) {
                    angular.forEach(result, function(item) {
                        item.checked = false;
                        $scope.productApplyInfo.push(item);
                    });
                    console.log($scope.productApplyInfo);
                }
                console.log($scope.productApplyDetailsAll);
            }, function(err) {
                console.log(err);
            });
        }

        function getApplyInfoDetailsAll(processList) {
            var params = {
                data: angular.toJson({ PROCESSLIST: processList })
            };
            baseServices.postPromise('query/getPurchaseProduct', params).then(function(result) {
                $scope.productApplyDetails = result;
                purchaseTotal = 0;
                if (result.length > 0) {
                    angular.forEach(result, function(item) {
                        $scope.purchaseInfoDetail = {
                            PROCESSID: '',
                            APPLY_PROCESSID: '',
                            PROCESSNO: guid(),
                            APPLY_PROCESSNO: item.PROCESSID,
                            PRODUCT_PROVIDER_ID: '',
                            PRODUCT_PROVIDER_NAME: '',
                            PRODUCT_PURCHASE_DATE: mini.formatDate(new Date(), 'yyyy-MM-dd'),
                            PRODUCT_NO: item.PRODUCT_NO,
                            PRODUCT_ID: item.PRODUCT_ID,
                            PRODUCT_NAME: item.PRODUCT_NAME,
                            PRODUCT_DESC: item.PRODUCT_DESC,
                            PRODUCT_REMARK: item.PRODUCT_REMARK,
                            PRODUCT_SPEC: item.PRODUCT_SPEC,
                            PRODUCT_UNIT_ID: item.PRODUCT_UNIT_ID,
                            PRODUCT_UNIT_NAME: item.PRODUCT_UNIT_NAME,
                            PRODUCT_CATEGORY_ID: item.PRODUCT_CATEGORY_ID,
                            PRODUCT_CATEGORY_NAME: item.PRODUCT_CATEGORY_NAME,
                            PRODUCT_PURPRICE: item.PRODUCT_PURPRICE,
                            PRODUCT_PURCHASE_NUM: item.PRODUCT_APPLY_NUM,
                            PRODUCT_IMG_DOCID: item.PRODUCT_IMG_DOCID
                        };
                        purchaseTotal += (Number(item.PRODUCT_PURPRICE) * Number(item.PRODUCT_APPLY_NUM));
                        $scope.purchaseInfoDetails.push($scope.purchaseInfoDetail);
                    });
                }



            }, function(err) {
                console.log(err);
            })
        }

        $scope.showDetails = function(processId) {
            $scope.item = {
                processId: processId
            }
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body3',
                templateUrl: 'myModalContent.html',
                controller: 'ShowDetailsInstanceCtrl',
                resolve: {
                    item: function() {
                        return $scope.item;
                    }
                }
            });

            modalInstance.result.then(function(result) {

            }, function() {

            });
        }

        $scope.fnChecked = function(item) {
            angular.forEach($scope.productApplyInfo, function(i) {
                if (item.PROCESSID == i.PROCESSID)
                    i.checked = item.checked;
            });
        }


        function getPurchaseInfo(processId) {
            var params = {
                data: angular.toJson({ PROCESSID: processId })
            }
            baseServices.postPromise('query/getPurchaseInfo', params).then(function(result) {
                $scope.getPurchaseInfo = result[0];
                console.log($scope.getPurchaseInfo);
            }, function(err) {
                console.log(err);
            });
            baseServices.postPromise('query/getPurchaseInfoDetails', params).then(function(result) {
                $scope.purchaseInfoDetails = result;
                console.log($scope.purchaseInfoDetails);
            }, function(err) {
                console.log(err);
            });

        }



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
                    if (item.varKey == "applicant")
                        $scope.processVeriables[item.varKey] = currentUser.userName;
                });
            });

            $scope.productPurchaseInfo = {
                PROCESSID: '',
                PROCESSNO: '',
                PRODUCT_PURCHASE_DATE: mini.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                PURCHASE_DESC: '',
                PURCHASE_DEPT: '',
                PURCHASE_PEOP: '',
                PROCESS_STATUS: '',
                PURCHASE_STATUS: '',
                PRODUCT_PURPRICE_TOTAL: 0
            };
            getApplyInfoAll();
        }

        if (taskId != 0) {
            $scope.isStart = false;
            processDetailFactory.gettaskDetails(taskId);
            $scope.$on('taskDetailserviceUpdata', function(event, req) {
                $scope.taskDetails = req.data;
                $scope.$parent.acceptTask(taskId, $scope.taskDetails.status);
                processDetailFactory.getProcessDetails($scope.taskDetails.processId);
                $scope.$on('processDetailserviceUpdata', function(event, req) {
                    $scope.processDetails = req.data;
                    $scope.orderTitle = formatShowName($scope.processDetails.processModelName);
                    $scope.orderModelId = $scope.processDetails.processModelId;
                    processDetailFactory.getActiveVariables($scope.taskDetails.status == 2 ? taskId : $scope.taskDetails.processId, $scope.taskDetails.status == 2 ? 'task' : 'process');
                    $scope.$on('activeVariableUpdata', function(event, req) {
                        $scope.processVeriables = req.data;
                        $scope.fileList = angular.fromJson($scope.processVeriables.files);
                        $scope.$broadcast('filesUpdate', $scope.fileList);
                        if ($scope.orderModelId == 3151) {
                            $scope.processVeriables.tradeType = angular.fromJson($scope.processVeriables.tradeType);
                        }

                        if ($scope.taskDetails.display != "申请人") {
                            $scope.processVeriables.orderStatus = $scope.taskDetails.display;
                        } else {
                            $scope.isStart = true;
                            isUpdate = true;
                        }
                    });
                });

                processDetailFactory.getProcessnotes($scope.taskDetails.processId);
                $scope.$on('notesServiceUpdata', function(event, req) {
                    $scope.notes = req.data;
                });
                if ($scope.taskDetails.display == "经办人") {
                    isUpdate = true;
                }
                getPurchaseInfo($scope.taskDetails.processId);
                console.log($scope.taskDetails);
            });
        }

        $scope.submit = function(type) {
            console.log($scope.purchaseInfoDetails);
            $scope.processVeriables.submitFlag = type;

            if ($scope.isStart && !isUpdate) {
                $scope.processVeriables.amount = purchaseTotal;
                var PROCESSLIST = '';
                var result = [];
                angular.forEach($scope.productApplyInfo, function(item) {
                    if (item.checked)
                        result.push(item.PROCESSID);
                });
                PROCESSLIST = result.join(',');
                getApplyInfoDetailsAll(PROCESSLIST);
                var data = {
                    formData: angular.toJson($scope.processVeriables)
                };
                data['uuid'] = modelDetails.uuid;
                baseServices.postPromise('SetProcessActiveVariable', data).then(function(result) {
                    $scope.submitApplyData(result);
                    baseServices.postPromise('execute/NewProductPurchase', {
                        purchaseData: angular.toJson($scope.productPurchaseInfo),
                        detailsData: angular.toJson($scope.purchaseInfoDetails)
                    }).then(function(rep) {
                        if (rep != 0) {
                            bootbox.alert({
                                message: '流程发起成功!',
                                size: 'small'
                            });
                            $timeout(function() {
                                $state.go("fileUpload", { reload: true });
                            }, 2000);
                        }
                    }, function(err) {
                        console.log(err);
                    });

                }, function(err) {
                    console.log(err);
                });
            } else if (type == '不同意') {
                var params = {
                    data: angular.toJson({ PROCESSID: $scope.taskDetails.processId })
                }
                baseServices.postPromise('execute/deletePurchaseInfo', params).then(function(result) {}, function(err) {
                    console.log(err);
                });
                baseServices.postPromise('execute/deletePurchaseInfoDetails', params).then(function(result) {}, function(err) {
                    console.log(err);
                });
            } else {
                $scope.$parent.updateVeriables($scope.taskDetails.processId, taskId, { formData: angular.toJson($scope.processVeriables) }, type);
                var status, processStatus, params;

                if ((type == '提交') && ($scope.taskDetails.display == '领用人')) {
                    status = processStatus = "已完成";
                } else if ((type == '提交') && ($scope.taskDetails.display != '领用人')) {
                    status = processStatus = '已申请';
                } else if (type == '不同意') {
                    status = processStatus = "结束";
                }

                params = {
                    applyIds: $scope.taskDetails.processId,
                    status: status,
                    processStatus: processStatus
                }
                baseServices.postPromise('execute/updateApplyStatus', params).then(function(result) {
                    if (Number(result) > 0) {

                    }
                })
            }

        }

        $scope.submitApplyData = function(processID) {

            $scope.productPurchaseInfo.PROCESSID = processID;
            $scope.productPurchaseInfo.PROCESSNO = guid();
            $scope.productPurchaseInfo.PROCESS_STATUS = '提交';
            $scope.productPurchaseInfo.PURCHASE_STATUS = '提交';
            $scope.productPurchaseInfo.PURCHASE_PEOP = currentUser.userName;
            $scope.productPurchaseInfo.PURCHASE_DEPT = '';
            $scope.productPurchaseInfo.PRODUCT_PURPRICE_TOTAL = purchaseTotal;
            angular.forEach($scope.purchaseInfoDetails, function(item) {
                item.PROCESSID = processID;
            })
        }
    }])

angular.module('MaterialApp')
    .controller('ShowDetailsInstanceCtrl', function(baseServices, $scope, $uibModalInstance, item) {
        $scope.data = item;
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        function getApplyInfoDetailsAll(processList) {
            var params = {
                data: angular.toJson({ PROCESSLIST: processList }),
                pageIndex: 0,
                pageSize: 150
            };
            baseServices.postPromise('query/getPurchaseProduct', params).then(function(result) {
                $scope.productApplyDetails = result;
                console.log($scope.productApplyDetails);
            }, function(err) {
                console.log(err);
            })

        }
        getApplyInfoDetailsAll($scope.data.processId);
    });