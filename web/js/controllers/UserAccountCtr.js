angular.module('MaterialApp')
    .controller('UserAccountCtr', ['$rootScope', '$scope', '$http', '$state', 'Upload', '$timeout', 
        function ($rootScope, $scope, $http, $state, Upload, $timeout) {
            $scope.userInfo = $rootScope.userInfo;
            $scope.userName = $scope.userInfo.userName;
            $scope.firstName = $scope.userInfo.firstName;
            $scope.email = $scope.userInfo.email;
            $scope.phoneMobile = $scope.userInfo.phoneMobile;
            $scope.customField1 = $scope.userInfo.customField1;
            $scope.customField2 = $scope.userInfo.customField2;
            $scope.customField3 = $scope.userInfo.customField3;
            $scope.showSelect = true;

            $scope.updateUserInfo = function () {
                mini.confirm("确定删除记录？", "确定？",
                    function (action) {
                        if (action == "ok") {
                            $scope.$apply(
                                function () {
                                    var dsata = {
                                        userName: $scope.userName,
                                        firstName: $scope.firstName,
                                        email: $scope.email,
                                        phoneMobile: $scope.phoneMobile,
                                        customField1: $scope.customField1,
                                        customField2: $scope.customField2,
                                        customField3: $scope.customField3
                                    };
                                    execute("GM_updateProfile", {data: mini.encode(dsata)});

                                }
                            )
                        } else {
                            $scope.userName = userInfo.userName;
                            $scope.firstName = userInfo.firstName;
                            $scope.email = userInfo.email;
                            $scope.phoneMobile = userInfo.phoneMobile;
                            $scope.customField1 = userInfo.customField1;
                            $scope.customField2 = userInfo.customField2;
                            $scope.customField3 = userInfo.customField3;
                        }
                    }
                );

            }

            $scope.updateImage = function (file, file1) {
                execute("GM_deleteDocument", {fileId: file1.field});
                $scope.file = file;
                file.upload = Upload.upload({
                    url: '/suite/plugins/servlet/UploadUserPhoto',
                    //data: {filePath:"默认社区/系统的知识中心/用户图片"},
                    file: file
                }).progress(function (evt) {
                    //进度条
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                }).success(function (data, status, headers, config) {
                    //上传成功
                    $timeout(function () {
                        file["field"] = data[0].id
                        file["status"] = status;
                        file["version"] = data[0].version;
                    });
                    $scope.file = file;
                    imgId = file.field;
                    $scope.showSelect = false;
                }).error(function (data, status, headers, config) {
                    //上传失败
                    console.log('error status: ' + status);
                });
            }

            $scope.removeImage = function (file) {
                execute("GM_deleteDocument", {fileId: file.field});
                $scope.showSelect = true;
                imgId = "";
            }

            $scope.uploadFile = function (file) {
                $scope.file = file;
                file.upload = Upload.upload({
                    url: '/suite/plugins/servlet/UploadUserPhoto',
                    // data: {filePath:"默认社区/系统的知识中心/用户图片"},
                    file: file
                }).progress(function (evt) {
                    //进度条
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                }).success(function (data, status, headers, config) {
                    //上传成功
                    $timeout(function () {
                        file["field"] = data[0].id
                        file["status"] = status;
                        file["version"] = data[0].version;
                        imgId = data[0].id;
                    });
                    $scope.file = file;
                    $scope.showSelect = false;
                }).error(function (data, status, headers, config) {
                    //上传失败
                    console.log('error status: ' + status);
                });
            }


            $scope.updatePass = function () {
                var rs;
                $.ajax({
                    url: "/suite/plugins/servlet/ChanageUserPassword",
                    type: "post",
                    data: {
                        user: userName,
                        oldPassword: $("#oldPassword").val(),
                        newPassword: $("#newPassword").val(),
                        confirmNewPassword: $("#confirmNewPassword").val()
                    },
                    async: false,
                    success: function (rstext) {
                        rs = rstext;
                        if (rs == 1) {
                            alert("密码修改成功。")
                            $uibModalInstance.close();
                        } else if (rs == 2) {
                            alert("旧密码不正确。")
                        } else if (rs == 3) {
                            alert("新密码和确认新密码不一致。")
                        } else if (rs == 4) {
                            alert("新密码不可与旧密码相同。")
                        } else if (rs == 5) {
                            alert("新密码规则不符合要求。")
                        }

                    },
                    error: function () {
                    }
                });

            }
            $scope.cancelUpdatePass = function () {
                $("#oldPassword").val("");
                $("#newPassword").val("");
                $("#confirmNewPassword").val("");
            };

        }]);
