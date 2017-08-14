/*根据接收附件的后缀信息决定改文件是否可以编辑等相关操作的Cotroller*/
angular.module('MaterialApp').controller('ArchiveInstanceCtrl', function ($scope, $sce, $q, $timeout, $interval, $uibModalInstance, item) {
    $scope.file = item.file;
    $scope.operation = item.operation;
    $scope.typeView = "doc";
    var vm = this;
    vm.rejectIt = false;
    var result = {};
    var dialog;

    if ($scope.file.suffix == "pdf") {
        $scope.typeView = "pdf";
        // 如果是pdf文档采用相应的pdf插件打开
        $scope.filePath = $sce.trustAsResourceUrl("tpl/page/pdfviewer.html?file=/suite/doc/" + $scope.file.field);
    }
    else if ($scope.file.suffix == "jpg" || $scope.file.suffix == "png" || $scope.file.suffix == "jpeg"
        || $scope.file.suffix == "gif" || $scope.file.suffix == "bmp") {
        $scope.typeView = "img";
        // 如果是图片文件直接打开
        $scope.filePath = "/suite/doc/" + $scope.file.field;
    }
    else if ($scope.file.suffix == "doc" || $scope.file.suffix == "docx" || $scope.file.suffix == "xls"
        || $scope.file.suffix == "xlsx" || $scope.file.suffix == "ppt" || $scope.file.suffix == "pptx") {
        $scope.typeView = "doc";
        $timeout(function () {
            objinit();
            if ($scope.file.field) {
                OpenTestDoc('/suite/doc/' + $scope.file.field);
            } else {
                OpenTestDoc('tpl/page/temp.docx');
            }
        }, 2000);
    } else {
        bootbox.alert({message: '该类型文件不支持查看！', size: 'small'});
        $scope.cancel();
    }
    $scope.ok = function () {
        dialog = bootbox.dialog({
            title: '信息提示',
            message: '<h5><i class="fa fa-spin fa-spinner"></i>正在保存附件...</h5>'
        });
        var pdfname = 'archive' + mini.formatDate(new Date(), 'yyyyMMddHHmmss') + '.doc';
        if (browser == "IE") {
            var data = "";
            if ($scope.file.field) {
                result.type = "modify";
                data = TANGER_OCX_OBJ.SaveToURL("/suite/plugins/servlet/UploadFile", "pdffilename", "fileId=" + $scope.file.field, $scope.file.name);
            } else {
                result.type = "new";
                data = TANGER_OCX_OBJ.SaveToURL("/suite/plugins/servlet/UploadFile", "pdffilename", "filePath=默认社区/临时文件知识中心/流程附件", pdfname);
            }
            data = eval("(" + data + ")");
            if (data.length > 0) {
                var file = {};
                file["field"] = data[0].id;
                file["status"] = 200;
                file["name"] = data[0].name + '.' + data[0].suffix;
                file["fieName"] = data[0].name;
                file["suffix"] = data[0].suffix;
                file["version"] = data[0].version;
                file["lastModified"] = mini.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                $scope.files = file;
                $scope.showMessage(1);
                result.file = $scope.files;
                $uibModalInstance.close(result);
            }
            else {
                $scope.showMessage(0);
            }
        }
        else {
            if ($scope.file.field) {
                result.type = "modify";
                TANGER_OCX_OBJ.SaveToURL("/suite/plugins/servlet/UploadFile", "pdffilename", "fileId=" + $scope.file.field, $scope.file.name);
            } else {
                result.type = "new";
                TANGER_OCX_OBJ.SaveToURL("/suite/plugins/servlet/UploadFile", "pdffilename", "filePath=默认社区/临时文件知识中心/流程附件", pdfname);
            }
            var timer = $interval(function () {
                $scope.doAsync(vm.rejectIt, false).then(function (data) {
                    console.log(data.resolveData);
                }, function (error) {
                    console.log(error.rejectData);
                });
            }, 600, 5);
            timer.then(function () {
                vm.rejectIt = !vm.rejectIt;
                //console.log("The attach was saved success!");
                $scope.showMessage(1);
                result.file = $scope.files;
                $uibModalInstance.close(result);
            }, function () {
                //console.log("The attach was saved error,this operation was cancelled!");
                $scope.showMessage(0);
            }, function () {
                console.log("The attach is updating...");
            });
        }
    };


    $scope.doAsync = function (rejectIt) {
        return $q(function (resolve, reject) {
            if (!rejectIt) {
                if (data_info.length > 0) {
                    vm.rejectIt = !vm.rejectIt;
                    var file = {};
                    file["field"] = data_info[0].id;
                    file["status"] = 200;
                    file["name"] = data_info[0].name + '.' + data_info[0].suffix;
                    file["fieName"] = data_info[0].name;
                    file["suffix"] = data_info[0].suffix;
                    file["version"] = data_info[0].version;
                    file["lastModified"] = mini.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    $scope.files = file;
                }
            } else {
                reject({
                    rejectData: 'reject it at ' + mini.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
                });
            }
        });
    }

    $scope.showMessage = function (isTure) {
        dialog.init(function () {
            setTimeout(function () {
                dialog.find('.bootbox-body').html('附件保存' + (isTure ? '成功' : '失败') + '!');
            }, 3000);
            setTimeout(function () {
                dialog.modal('hide');
            }, 4500);
        });
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});


// 模态层窗口上的确定和取消按钮方法
angular.module('MaterialApp').controller('SealInstanceCtrl', function ($scope, $timeout, $interval, $uibModalInstance, item) {

    $scope.ok = function () {

    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

angular.module('MaterialApp').controller('BaseProcessCtrl', ['$rootScope','$scope', '$state', '$timeout', 'baseServices', function ($rootScope,$scope, $state, $timeout, baseServices) {
    //获取当前用户信息
    var currentUser =$rootScope.userInfo;

    $scope.acceptTask = function (taskId, taskStatus) {
        if (taskStatus == 0) {
            var data = {id: taskId};
            baseServices.postPromise('execute/accepttask', data).then(function (req) {
            }, function (error) {
                console.log(error);
            });
        }
    }

    //获取附件信息
    $scope.getFiles = function (fileList) {
        var toNewFiles = [];
        if (typeof fileList != 'undefined') {
            for (var i = 0; i < fileList.length; i++) {
                var fileData = {
                    "name": fileList[i].name,
                    "fileName": fileList[i].fileName,
                    "progress": fileList[i].progress,
                    "field": fileList[i].field,
                    "status": fileList[i].status,
                    "version": fileList[i].version,
                    "size": fileList[i].size,
                    "suffix": fileList[i].suffix,
                    "type": fileList[i].type,
                    "lastModified": new Date(fileList[i].lastModified)
                };
                toNewFiles.push(fileData);
            }
        }
        return toNewFiles;
    }
    //提交流程表单参数
    $scope.submitVeriables = function (uuid, data) {
        data["uuid"] = uuid;
        baseServices.postPromise('SetProcessActiveVariable', data).then(function (req) {
            bootbox.alert({message: '流程发起成功!', size: 'small'});
            $timeout(function () {
                $state.go("fileUpload", {reload: true});
            }, 2000);
        }, function (err) {
            console.log(err);
        });
    }
    //修改流程表单参数
    $scope.updateVeriables = function (processId, taskId, data, type) {
        var fromData = data;
        fromData["id"] = processId;
        baseServices.postPromise('execute/updateprocessvariables', fromData).then(function (req) {
            $scope.setTaskActiveVeriables(processId, taskId, {formData: angular.toJson(data)}, type);
        }, function (err) {
            console.log(err);
        });

    }

    $scope.setTaskActiveVeriables = function (processId, taskId, data, type) {
        data["activityId"] = taskId;
        data["isSubmit"] = true;

        baseServices.postPromise('SetTaskActiveVariable', data).then(function (req) {
            bootbox.alert({message: '流程操作成功!', size: 'small'});
            $scope.setNote(processId, type);
            $timeout(function () {
                $state.go("task", {reload: true});
            }, 2000);
        }, function (err) {
            console.log(err);
        });
    }
    //设置流程评论（审批意见）
    $scope.setNote = function (processId, type) {
        if (angular.element("#note").val() != "") {
            var data = {
                id: processId,
                content: currentUser.firstName + "于" + mini.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss') + "(" + type + ")该记录 | 附加信息： " + (angular.element("#note").val() || ""),
                paramOrder: "id,content"
            }
            baseServices.postPromise("execute/createprocessnote", data).then(function (data) {
                if (data != null) {
                    baseServices.post("getprocessnotes?id=" + processId).then(function (req) {
                        $scope.notes = req;
                    });
                }
            }, function (err) {
                console.log(err);
            })
        }
    }
}]);

angular.module('MaterialApp', ['ngFileUpload']).controller('ArchiveFileUpload', ['$rootScope', '$scope', '$uibModal', '$document', '$timeout', 'Upload', 'attachOperation', function ($rootScope, $scope, $uibModal, $document, $timeout, Upload, attachOperation) {
    var totalFiles = [];
    $scope.$on('filesUpdate', function (event, rep) {
        totalFiles = rep;
        $scope.fileList = totalFiles;
    })

    $scope.attach = attachOperation;
    $scope.animationsEnabled = true;

    $scope.uploadFiles = function (files, errFiles) {
        $scope.files = files;
        $scope.errFiles = errFiles;
        angular.forEach(files, function (file) {
            file.upload = Upload.upload({
                url: '/suite/plugins/servlet/UploadFile',
                data: {filePath: "默认社区/临时文件知识中心/流程附件"},
                file: file
            }).progress(function (evt) {
                //进度条
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (data, status, headers, config) {
                //上传成功
                $timeout(function () {
                    if (data != '') {
                        file["field"] = data[0].id;
                        file["status"] = status;
                        file["fieName"] = data[0].name;
                        file["suffix"] = data[0].suffix;
                        file["version"] = data[0].version;
                        file["lastModified"] = mini.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                        totalFiles.push(file);
                        $scope.fileList = totalFiles;
                        $scope.$emit('filesUpdate', $scope.fileList);
                        angular.element(".first-process-archives").height(angular.element(".tables").height() + 120);
                        angular.element(".list-item-btns").hide();
                    }
                }, 2000);
            }).error(function (data, status, headers, config) {
                //上传失败
                console.log('error status: ' + status);
            });
        });
    }

    $scope.remove = function (file) {
        $scope.fileList.splice($scope.fileList.indexOf(file), 1);
        execute("GM_deleteDocument", {fileId: file.field});
        totalFiles = $scope.fileList;
        $scope.$emit('filesUpdate', $scope.fileList);
    }

    $scope.tabs = [{
        title: 'One',
        value: 'one',
        class: 'fa fa-th-list',
        isSelect: false
    }, {
        title: 'Two',
        value: 'two',
        class: 'fa fa-th',
        isSelect: true
    }];

    $scope.defaultValue = "two";
    $scope.onClickTab = function () {
        angular.forEach($scope.tabs, function (item) {
            if (item.value == $scope.defaultValue) {
                item.isSelect = true;
            } else {
                item.isSelect = false;
            }
        })
    }
    $scope.typeChanged = function (value) {
        $scope.defaultValue = value;
        $scope.onClickTab();
    }

    $scope.isDoc = function (type) {
        if (type == "doc" || type == "docx" || type == "xls" || type == "xlsx"
            || type == "ppt" || type == "pptx") {
            return true;
        }
        else
            return false;
    }

    $scope.open = function (file, operation, parentSelector) {
        var parentElem = parentSelector ?
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        if (file == null) {
            file = {};
            file.field = "";
            file.suffix = "doc";
        }
        $scope.item = {file: file, operation: operation};
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: 'ArchiveInstanceCtrl',
            appendTo: parentElem,
            resolve: {
                item: function () {
                    return $scope.item;
                }
            }
        });
        modalInstance.result.then(function (result) {
            if (result.type == 'new') {
                console.log(result.file);
                $scope.fileList.push(result.file);
            }
        }, function () {

        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };
}]);

angular.module('MaterialApp').controller('ArchiveFileList', ['$rootScope', '$scope', '$uibModal', '$document', '$timeout', 'attachOperation', function ($rootScope, $scope, $uibModal, $document, $timeout, attachOperation) {
    var totalFiles = $scope.$parent.fileList;
    $scope.fileList = totalFiles
    $scope.attach = attachOperation;
    $scope.animationsEnabled = true;

    // 删除附件信息
    $scope.remove = function (file) {
        $scope.fileList.splice($scope.fileList.indexOf(file), 1);
        totalFiles = $scope.fileList;
        execute("GM_deleteDocument", {fileId: file.field});
        $scope.$parent.fileList = $scope.fileList;
    }

    // 打开模态层窗口方法
    $scope.open = function (file, operation, parentSelector) {
        var parentElem = parentSelector ?
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        if (file == null) {
            file = {};
            file.field = "";
            file.suffix = "doc";
        }
        $scope.item = {file: file, operation: operation};

        // 打开附件模态层窗口
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: 'ArchiveInstanceCtrl',
            appendTo: parentElem,
            resolve: {
                item: function () {
                    return $scope.item;
                }
            }
        });
        modalInstance.result.then(function (result) {
            if (result.type == 'new') {
                console.log(result.file);
                $scope.fileList.push(result.file);
            }
        }, function () {

        });
    };

    $scope.getArchive = function (parentSelector) {
        var parentElem = parentSelector ?
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;

        $scope.item = {};

        // 添加附件模态层窗口
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'sealModalContent.html',
            controller: 'SealInstanceCtrl',
            appendTo: parentElem,
            resolve: {
                item: function () {
                    return $scope.item;
                }
            }
        });
        modalInstance.result.then(function (result) {
            if (result.type == 'new') {
                $scope.fileList.push(result.file);
            }
        }, function () {

        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };
}]);

// 给附件信息的不同状态定义初始值
angular.module('MaterialApp').value('attachOperation', {
    hasView: false,
    hasModify: false,
    hasNew: false,
    hasRemove: false,
    hasDownload: false
});


