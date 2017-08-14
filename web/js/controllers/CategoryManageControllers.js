angular.module('MaterialApp').controller('CategoryManagerCtl', ['$scope', '$state', 'baseServices', function($scope, $state, baseServices) {
    $scope.type = "";
    $scope.total = 0;
    $scope.pageIndex = 0;

    baseServices.postPromise('query/sysConst', {}).then(function(result) {
        $scope.typeList = result;
    }, function(err) {
        console.log(err);
    });

    function loadCategory(type) {
        var params = {
            data: angular.toJson({ type: type }),
            pageIndex: $scope.pageIndex,
            pageSize: 15
        };

        baseServices.postPromise('query/getCategoryAll', params).then(function(result) {
            $scope.total = result.total;
            $scope.categorys = result.data;
        }, function(err) {
            console.log(err);
        });
    }
    loadCategory('');
    $scope.addItem = function() {
        $scope.updateItem(0);
    };
    $scope.updateItem = function(id) {
        $state.go('sysManage.CategoryDetails', { id: id });
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
                    baseServices.postPromise('execute/deleteCategory ', { data: angular.toJson(data) }).then(function(result) {
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
        loadCategory($scope.type);
    };

}]);

angular.module('MaterialApp', ['ngFileUpload']).controller('CategoryDetailsCtl', ['$scope', '$state', '$stateParams', '$timeout', 'baseServices', 'Upload', function($scope, $state, $stateParams, $timeout, baseServices, Upload) {
    baseServices.postPromise('query/sysConst', {}).then(function(result) {
        $scope.typeList = result;
    }, function(err) {
        console.log(err);
    });
    var data = { type: "ASSET" };
    baseServices.postPromise('query/getAssetCategoryAll', data).then(function(result) {
        $scope.categoryList = result;
    }, function(err) {
        console.log(err);
    });

    if ($stateParams.id != null && $stateParams.id != 0) {
        var data = {
            ID: $stateParams.id
        };
        baseServices.postPromise('query/getCategory', { data: angular.toJson(data) }).then(function(result) {
            $scope.category = result[0];
        }, function(err) {
            console.log(err);
        });
    } else {
        $scope.category = {
            CATEGORY_ID: '',
            CATEGORY_NAME: '',
            CATEGORY_PARENT_ID: '',
            CATEGORY_DESC: '',
            CATEGORY_TYPE: ' ',
            CATEGORY_SORT: '0',
            CATEGORY_CREATEDATE: mini.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
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
                            $scope.category.CATEGORY_DESC = data[0].id;
                        }
                    }, 2000);
                })
                .error(function(data, status, headers, config) {
                    //上传失败
                    console.log('error status: ' + status);
                });
        });
    };


    $scope.submit = function() {
        $scope.category.CATEGORY_CREATEDATE = mini.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
        $scope.category.CATEGORY_ID = guid();
        baseServices.postPromise('query/uniqueField', { data: angular.toJson({ value: $scope.product.PRODUCT_NAME, id: $scope.product.ID || null }) }).then(function(result) {
                if (result[0].COUNT == "0") {
                    if ($scope.category.ID) {
                        baseServices.postPromise('execute/ModifyCategory', { data: angular.toJson($scope.category) }).then(function(result) {
                            if (result == 1)
                                bootbox.alert({ message: '提交数据成功!', size: 'small' });
                            else
                                bootbox.alert({ message: '提交数据失败!', size: 'small' });
                        }, function(err) {
                            console.log(err);
                        });
                    } else {
                        baseServices.postPromise('execute/NewCategory', { data: angular.toJson($scope.category) }).then(function(result) {
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

angular.module('MaterialApp').filter('notparent', function() {
    return function(obj) {
        var result = [];
        angular.forEach(obj, function(item) {
            if (item.CATEGORY_PARENT_ID == '' || item.CATEGORY_PARENT_ID == "null") {
                result.push(item);
            }
        });

        return result;
    };
});