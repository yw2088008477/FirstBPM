angular.module('MaterialApp').controller('ProductManagerCtl', ['$scope', '$state', 'baseServices', function($scope, $state, baseServices) {
    $scope.type = "";
    $scope.total = 0;
    $scope.pageIndex = 0;

    function loadCategory() {
        var params = {
            data: angular.toJson({ type: 'ASSET' }),
            pageIndex: $scope.pageIndex,
            pageSize: 100
        };

        baseServices.postPromise('query/getCategoryAll', params).then(function(result) {
            $scope.categoryList = result.data;
        }, function(err) {
            console.log(err);
        });

    }

    function loadData(category) {
        var params = {
            data: angular.toJson({ category: category }),
            pageIndex: $scope.pageIndex,
            pageSize: 100
        };

        baseServices.postPromise('query/getProductInfoAll', params).then(function(result) {
            $scope.products = result.data;
        }, function(err) {
            console.log(err);
        });
    }
    loadCategory();
    loadData();

    $scope.addItem = function() {
        $scope.updateItem(0);
    };
    $scope.updateItem = function(id) {
        $state.go('sysManage.ProductDetails', { id: id })
    };
    $scope.deleteItem = function(data) {

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
                    baseServices.postPromise('execute/deleteProductInfo  ', { data: angular.toJson(data) }).then(function(result) {
                        bootbox.alert({ message: '您已成功删除数据', size: 'small' });
                        $state.reload();
                    }, function(err) {
                        console.log(err);
                    });
                }
            }
        });



    };
    $scope.selectItem = function() {
        loadData($scope.type);
    };

}]);
angular.module('MaterialApp', ['ngFileUpload']).controller('ProductDetailsCtl', ['$scope', '$state', '$stateParams', '$timeout', 'baseServices', '$rootScope', 'Upload', function($scope, $state, $stateParams, $timeout, baseServices, $rootScope, Upload) {
    var ListData = {};
    var currentUser = $rootScope.userInfo;

    function getData(type) {
        return { type: type };
    }

    function getName(id, type) {
        var dataItem = ListData[type];
        var result = '';
        angular.forEach(dataItem, function(item) {
            if (item.ID == id)
                result = item.CATEGORY_NAME;
        });
        return result;
    }

    baseServices.postPromise('query/getAssetCategoryAll', getData("ASSET")).then(function(data) {
        $scope.categoryList = data;
        ListData.ASSET = data;
    }, function(err) {
        console.log(err);
    });

    baseServices.postPromise('query/getAssetCategoryAll', getData("UNIT")).then(function(data) {
        $scope.unitsList = data;
        ListData.UNIT = data;
    }, function(err) {
        console.log(err);
    });

    if ($stateParams.id != null && $stateParams.id != 0) {
        var data = {
            ID: $stateParams.id
        };
        baseServices.postPromise('query/getProductInfo', { data: angular.toJson(data) }).then(function(data) {
            console.log(data);
            $scope.product = data[0];
        }, function(err) {
            console.log(err);
        });
    } else {
        $scope.product = {
            PRODUCT_NO: '',
            PRODUCT_NAME: '',
            PRODUCT_DESC: '',
            PRODUCT_REMARK: '',
            PRODUCT_SPEC: '',
            PRODUCT_UNIT_ID: '',
            PRODUCT_UNIT_NAME: '',
            PRODUCT_CATEGORY_ID: '',
            PRODUCT_CATEGORY_NAME: '',
            PRODUCT_PROVIDER_ID: '',
            PRODUCT_PROVIDER_NAME: '',
            PRODUCT_PURPRICE: '',
            PRODUCT_HAS_NUM: '',
            PRODUCT_IMG_DOCID: '',
            PRODUCT_CREATEDATE: mini.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            PRODUCT_ADD_PEOP: currentUser.userName
        };
    }

    $scope.uploadFiles = function(files, file1, errFiles) {
        $scope.files = files;
        $scope.errFiles = errFiles;
        if (file1) {
            var data = { fileId: file1.field };
            baseServices.postPromise('execute/GM_deleteDocument', data).then(function(result) {
                console.log(result);
            }, function(err) {
                console.log(err);
            });
        }
        angular.forEach(files, function(file) {
            file.upload = Upload.upload({
                    url: '/suite/plugins/servlet/UploadFile',
                    data: { filePath: "默认社区/临时文件知识中心/资产管理图片" },
                    file: file
                })
                .progress(function(evt) {
                    //进度条
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                })
                .success(function(data, status, headers, config) {
                    //上传成功
                    $timeout(function() {
                        if (data != '') {
                            $scope.product.PRODUCT_IMG_DOCID = data[0].id;
                        }
                    }, 2000);
                })
                .error(function(data, status, headers, config) {
                    //上传失败
                    console.log('error status: ' + status);
                });
            $scope.isShowImg = true;
        });
    };


    $scope.submit = function() {
        $scope.product.PRODUCT_CREATEDATE = mini.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
        $scope.product.PRODUCT_UNIT_NAME = getName($scope.product.PRODUCT_UNIT_ID, 'UNIT');
        $scope.product.PRODUCT_CATEGORY_NAME = getName($scope.product.PRODUCT_CATEGORY_ID, 'ASSET');
        $scope.product.PRODUCT_NO = guid();

        baseServices.postPromise('query/uniqueField', { data: angular.toJson({ value: $scope.product.PRODUCT_NAME, id: $scope.product.ID || null }) }).then(function(result) {
                if (result[0].COUNT == "0") {
                    if ($scope.product.ID) {
                        baseServices.postPromise('execute/ModifyProductInfo', { data: angular.toJson($scope.product) }).then(function(result) {
                            if (result == 1)
                                bootbox.alert({ message: '提交数据成功!', size: 'small' });
                            else
                                bootbox.alert({ message: '提交数据失败!', size: 'small' });
                        }, function(err) {
                            console.log(err);
                        });
                    } else {
                        baseServices.postPromise('execute/NewProductInfo', { data: angular.toJson($scope.product) }).then(function(result) {
                            console.log($scope.product);
                            if (result == 1)
                                bootbox.alert({ message: '提交数据成功!', size: 'small' });
                            else
                            bootbox.alert({ message: '提交数据失败!', size: 'small' });
                        }, function(err) {
                            console.log(err);
                        });
                    }
                } else {
                    bootbox.alert({ message: $scope.category.CATEGORY_NAME + '数据已存在!', size: 'small' });
                }

            },
            function(err) {
                console.log(err);
            });

    };
}]);

angular.module('MaterialApp').filter('hasparent', function() {
    return function(obj) {
        var result = [];
        angular.forEach(obj, function(item) {
            if (item.CATEGORY_PARENT_ID != '' && item.CATEGORY_PARENT_ID != "null" && item.CATEGORY_PARENT_ID != null) {
                result.push(item);
            }
        });

        return result;
    };
});