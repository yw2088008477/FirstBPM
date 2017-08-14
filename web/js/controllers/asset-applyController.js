angular.module('MaterialApp')
    .controller('AssetApplyCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', 'processDetailFactory', 'baseServices', function($rootScope, $scope, $state, $stateParams, $timeout, processDetailFactory, baseServices) {
        var modelId = 0;
        var taskId = 0;
        var modelDetails = [];
        var isUpdate = false;
        $scope.formId = "";
        $scope.isStart = true;
        $scope.processVeriables = {};
        $scope.taskDetails = {};
        $scope.productInfo = {};
        $scope.productApplyInfo = {};
        $scope.productApplyDetail = {};
        $scope.productApplyDetails = [];
        $scope.parentList = [];

        if (typeof $stateParams.processModelId != 'undefined')
            modelId = $stateParams.processModelId;
        if (typeof $stateParams.taskId != 'undefined')
            taskId = $stateParams.taskId;

        var currentUser = $rootScope.userInfo;

        $scope.parentChange = function(parentId) {
            var params = {
                data: angular.toJson({
                    type: 'ASSET',
                    parent: parentId
                }),
                pageIndex: 0,
                pageSize: 500
            }
            baseServices.postPromise('query/getCategoryAll', params).then(function(result) {
                $scope.categoryList = result.data;
            }, function(err) {
                console.log(err);
            });
        }
        $scope.categoryChange = function(categoryId, categoryName) {
            $scope.categoryShowName = categoryName || "未知分类";
            var params = {
                data: angular.toJson({
                    category: categoryId
                }),
                pageIndex: 0,
                pageSize: 500
            }
            baseServices.postPromise('query/getProductInfoAll', params).then(function(result) {
                $scope.productList = result.data;
                $scope.productChange($scope.productList[0].ID, $scope.productList[0].PRODUCT_NAME);
            }, function(err) {
                console.log(err);
            });
        }
        $scope.productChange = function(productId, productName) {
            $scope.productShowName = productName || "未知分类";
            var params = {
                data: angular.toJson({
                    id: productId
                }),
                pageIndex: 0,
                pageSize: 500
            }
            baseServices.postPromise('query/getProductInfoAll', params).then(function(result) {
                $scope.productInfo = result.data[0];
                var data = result.data[0];
                $scope.productApplyDetail = {
                    PROCESSID: 536872508,
                    PROCESSNO: guid(),
                    PRODUCT_PROVIDER_ID: '',
                    PRODUCT_PROVIDER_NAME: '',
                    PRODUCT_APPLY_DATE: '',
                    PRODUCT_APPLY_DESC: '',
                    PRODUCT_NO: data.PRODUCT_NO,
                    PRODUCT_ID: data.ID,
                    PRODUCT_NAME: data.PRODUCT_NAME,
                    PRODUCT_DESC: data.PRODUCT_DESC,
                    PRODUCT_REMARK: data.PRODUCT_REMARK,
                    PRODUCT_SPEC: data.PRODUCT_SPEC,
                    PRODUCT_UNIT_ID: data.PRODUCT_UNIT_ID,
                    PRODUCT_UNIT_NAME: data.PRODUCT_UNIT_NAME,
                    PRODUCT_CATEGORY_ID: data.PRODUCT_CATEGORY_ID,
                    PRODUCT_CATEGORY_NAME: data.PRODUCT_CATEGORY_NAME,
                    PRODUCT_PURPRICE: data.PRODUCT_PURPRICE,
                    PRODUCT_APPLY_NUM: '1',
                    PRODUCT_IMG_DOCID: data.PRODUCT_IMG_DOCID
                }
            }, function(err) {
                console.log(err);
            });
        }

        function getApplyInfo(processID) {
            var params = {
                data: angular.toJson({
                    PROCESSID: processID
                }),
                pageIndex: 0,
                pageSize: 150
            }
            baseServices.postPromise('query/getApplyInfo', params).then(function(result) {
                $scope.productApplyInfo = result.data[0];
                console.log($scope.productApplyInfo);
            }, function(err) {
                console.log(err);
            });
            baseServices.postPromise('query/getApplyInfoDetails', params).then(function(result) {
                $scope.productApplyDetails = result.data;
            }, function(err) {
                console.log(err);
            });
        }

        function loadProducts() {
            baseServices.postPromise('query/getAssetCategoryAll', {
                type: "ASSET"
            }).then(function(data) {
                angular.forEach(data, function(item) {
                    if (item.CATEGORY_PARENT_ID == "" || item.CATEGORY_PARENT_ID == "null") {
                        $scope.parentList.push(item);
                    }
                });
                $scope.parentChange($scope.parentList[0]['ID']);
                $timeout(function() {
                    if ($scope.categoryList) {
                        $scope.categoryChange($scope.categoryList[0]["ID"], $scope.categoryList[0]["CATEGORY_NAME"]);
                        $timeout(function() {
                            if ($scope.productList) {
                                $scope.productChange($scope.productList[0]["ID"], $scope.productList[0]["PRODUCT_NAME"]);
                            }
                        }, 300);
                    }
                }, 300);
                $timeout(function() {
                    if ($scope.parentList.length > 0) {
                        angular.element("#firstpane .first-asset-list").css("display", "none");
                        angular.element("#firstpane li:eq(0) .first-asset-list").show();
                        angular.element("#firstpane li:eq(0)").addClass("current");
                        /* alert(angular.element("#firstpane li:eq(0) .first-asset-list").innerHTML);*/
                        angular.element("#firstpane li a.panel-heading").click(function() {
                            if (!angular.element(this).parent().hasClass("current")) {
                                angular.element(this).parent().addClass("current");
                                angular.element("#firstpane li").not(angular.element(this).parent()).removeClass("current");
                                angular.element("#firstpane li .first-asset-list").slideUp(0);
                                angular.element("#firstpane li.current .first-asset-list").slideDown(1000);
                            }
                            // alert($(this).siblings(".first-asset-list").length);
                            //$(this).addClass("current").next(".first-asset-list").slideToggle(300);
                        });
                    }
                }, 10);
            }, function(err) {
                console.log(err);
            });
        }
        loadProducts();

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

            $scope.productApplyInfo = {
                PROCESSID: '',
                PROCESSNO: '',
                PRODUCT_APPLY_DATE: mini.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                PRODUCT_EXPIRE_DATE: '',
                APPLY_DESC: '',
                APPLY_DEPT: '',
                APPLY_PEOP: '',
                PROCESS_STATUS: '',
                APPLY_STATUS: '',
                PRODUCT_PURPRICE_TOTAL: 0
            };

            $scope.fileList = [];
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
                    getApplyInfo($scope.taskDetails.processId);
                    $scope.notes = query("getprocessnotes", {
                        id: $scope.taskDetails.processId
                    });
                });
                processDetailFactory.getProcessnotes($scope.taskDetails.processId);
                $scope.$on('notesServiceUpdata', function(event, req) {
                    $scope.notes = req.data;
                });
                if ($scope.taskDetails.display == "经办人") {
                    isUpdate = true;
                }
            });
        }

        $scope.addApplyItem = function() {
            console.log($scope.productApplyDetail);
            console.log($scope.productApplyDetails);
            if ($scope.productApplyDetail) {
                var flag = false;
                if ($scope.productApplyDetails.length > 0) {
                    angular.forEach($scope.productApplyDetails, function(item) {
                        if (item.PRODUCT_ID == $scope.productApplyDetail.PRODUCT_ID) {
                            item.PRODUCT_APPLY_NUM = Number(item.PRODUCT_APPLY_NUM) + Number($scope.productApplyDetail.PRODUCT_APPLY_NUM);
                            flag = true;
                        }
                        $scope.totalMoney += Number(item.PRODUCT_APPLY_NUM) * Number(item.PRODUCT_PURPRICE);
                    });
                }
                if (!flag)
                    $scope.productApplyDetails.push($scope.productApplyDetail);

                $scope.productChange($scope.productApplyDetail.PRODUCT_ID, $scope.productApplyDetail.PRODUCT_NAME);

            }
            $scope.productApplyInfo.PRODUCT_PURPRICE_TOTAL = 0;
            angular.forEach($scope.productApplyDetails, function(item) {
                $scope.productApplyInfo.PRODUCT_PURPRICE_TOTAL += Number(item.PRODUCT_PURPRICE) * Number(item.PRODUCT_APPLY_NUM);
            });
        };
        $scope.deleteItem = function(item) {
            $scope.productApplyDetails.splice(item, 1);
        };
        $scope.reload = function() {
            $scope.productApplyInfo.PRODUCT_EXPIRE_DATE = '';
            $scope.productApplyInfo.PRODUCT_PURPRICE_TOTAL = 0;
            $scope.productApplyDetails = [];
            $scope.productApplyInfo.APPLY_DESC = '';
        };
        $scope.deleteApplyItem = function(data) {
            bootbox.confirm({
                size: "small",
                title: "信息提示",
                message: "确定要删除该条记录么？",
                buttons: {
                    cancel: {
                        label: '<i class="fa fa-times"></i> 取消'
                    },
                    confirm: {
                        label: '<i class="fa fa-check"></i> 确定'
                    }
                },
                callback: function(result) {
                    if (result) {
                        baseServices.postPromise('execute/deleteProductApply', {
                            data: angular.toJson(data),
                            tablename: 'TB_PRODUCT_APPLY'
                        }).then(function(result) {
                            bootbox.alert({
                                message: '您已成功删除数据',
                                size: 'small'
                            });
                            $state.reload();
                        }, function(err) {
                            console.log(err);
                        })
                    }
                }
            });
        }

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
                        if ($scope.taskDetails.display == "申请人") {
                            return true;
                        } else if ($scope.taskDetails.display == "复核人") {
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
                if (field == "permission" || field == "sysName" || field == "usrName" || field == "applyReason" || field == "applyType" || field == "agreeDate" || field == "title" || field == "content" || field == "parameterType" || field == "isPurchase" || field == "purchaseStatus" || field == "isVersion" || field == "versionStatus" || field == "reqStatus" || field == "btn2"||field=="btn3") {
                    return false;
                } else
                    return true;
            }
        }

        $scope.submit = function(type) {
            $scope.processVeriables.submitFlag = type;
            if ($scope.isStart && !isUpdate) {
                var data = {
                    formData: angular.toJson($scope.processVeriables)
                };
                data['uuid'] = modelDetails.uuid;
                baseServices.postPromise('SetProcessActiveVariable', data).then(function(result) {
                    $scope.submitApplyData(result);
                    baseServices.postPromise('execute/NewApplyInfo', {
                        applyData: angular.toJson($scope.productApplyInfo),
                        detailsData: angular.toJson($scope.productApplyDetails)
                    }).then(function(rep) {
                        if (rep != 0 && $scope.productApplyInfo.APPLY_DESC != "" && $scope.productApplyInfo.PRODUCT_EXPIRE_DATE != ""){
                            bootbox.alert({
                                message: '流程发起成功!',
                                size: 'small'
                            });
                            $timeout(function () {
                                $state.go("fileUpload", {reload: true});
                            }, 2000);}
                        else
                            bootbox.alert({
                                message: '请填写必填（带红色*）项的内容',
                                size: 'small'
                            });
                    }, function(err) {
                        console.log(err);
                    });

                }, function(err) {
                    console.log(err);
                });
            }
            else if($scope.isStart && isUpdate){
                var params = {
                    data:angular.toJson({PROCESSID:$scope.taskDetails.processId})
                }
                baseServices.postPromise('execute/deleteApplyInfo',params).then(function(result) {
                }, function(err) {
                    console.log(err);
                });
                baseServices.postPromise('execute/deleteApplyInfoDetails',params).then(function(result) {
                }, function(err) {
                    console.log(err);
                });
                $scope.submitApplyData($scope.taskDetails.processId);
                baseServices.postPromise('execute/NewApplyInfo', {
                    applyData: angular.toJson($scope.productApplyInfo),
                    detailsData: angular.toJson($scope.productApplyDetails)
                }).then(function(rep) {
                    if (rep != 0 && $scope.productApplyInfo.APPLY_DESC != "" && $scope.productApplyInfo.PRODUCT_EXPIRE_DATE != "") {
                        $scope.$parent.updateVeriables($scope.taskDetails.processId, taskId, {formData: angular.toJson($scope.processVeriables)}, type);
                    }
                    else
                        bootbox.alert({
                            message: '请填写必填（带红色*）项的内容',
                            size: 'small'
                        });
                }, function(err) {
                    console.log(err);
                });

            }
            else {
                $scope.$parent.updateVeriables($scope.taskDetails.processId,taskId, {
                    formData: angular.toJson($scope.processVeriables)
                }, type);
                var status,processStatus,params;
                status = processStatus = (type=='提交')?'已申请':(type=='不同意'?'结束':'提交');
                params = {
                    applyIds:$scope.taskDetails.processId,
                    status:status,
                    processStatus:processStatus
                }
                baseServices.postPromise('execute/updateApplyStatus',params).then(function(result){
                    if(Number(result)>0){

                    }
                })
            }
        }

        $scope.submitApplyData = function(processID) {
            $scope.productApplyInfo.PROCESSID = processID;
            $scope.productApplyInfo.PROCESSNO = guid();
            $scope.productApplyInfo.PROCESS_STATUS = '提交';
            $scope.productApplyInfo.APPLY_STATUS = '提交';
            $scope.productApplyInfo.APPLY_PEOP = currentUser.userName;
            $scope.productApplyInfo.APPLY_DEPT = '';
            $scope.productApplyInfo.PRODUCT_PURPRICE_TOTAL = 0;
            angular.forEach($scope.productApplyDetails, function(item) {
                item.PROCESSID = processID;
                $scope.productApplyInfo.PRODUCT_PURPRICE_TOTAL += Number(item.PRODUCT_PURPRICE) * Number(item.PRODUCT_APPLY_NUM);
            })
        }
    }])