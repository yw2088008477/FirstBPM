//获取浏览器页面可见高度和宽度
var _PageHeight = document.documentElement.clientHeight,
    _PageWidth = document.documentElement.clientWidth;
//计算loading框距离顶部和左部的距离（loading框的宽度为215px，高度为61px）
var _LoadingTop = _PageHeight > 61 ? (_PageHeight - 61) / 2 : 0,
    _LoadingLeft = _PageWidth > 215 ? (_PageWidth - 215) / 2 : 0;
//在页面未加载完毕之前显示的loading Html自定义内容
var _LoadingHtml = '<div id="loadingDiv" style="position:absolute;left:0;width:100%;height:' + 500 + 'px;top:0;background:#f3f8ff;opacity:1;filter:alpha(opacity=80);z-index:10000;"><div style="position: absolute; cursor1: wait; left: ' + _LoadingLeft + 'px; top:' + _LoadingTop + 'px; width: auto; height: 57px; line-height: 57px; padding-left: 50px; padding-right: 5px; background: #000 url(/suite/plugins/processAndTasks/miniui3.6/themes/loader.gif) no-repeat scroll 5px 10px; border: 0px solid #95B8E7;-moz-border-radius:20px;-webkit-border-radius:20px;border-radius:20px; color: #696969; font-family:\'Microsoft YaHei\';">Loading pages...</div></div>';
//呈现loading效果
document.write(_LoadingHtml);

//window.onload = function () {
//    var loadingMask = document.getElementById('loadingDiv');
//    loadingMask.parentNode.removeChild(loadingMask);
//};

//监听加载状态改变
document.onreadystatechange = completeLoading;

//加载状态为complete时移除loading效果
function completeLoading() {
    if (document.readyState == "complete") {
        var loadingMask = document.getElementById('loadingDiv');
        loadingMask.parentNode.removeChild(loadingMask);
    }
}

var doc_ob_id = [];
var imgId = "";
var contentId = [];
var atarchId = [];
var data_info = [];
var app = angular.module('MetronicApp1', ['ngFileUpload']);
var totalFiles = [];
app.controller('newsAddController', ['$scope', 'Upload', '$timeout', '$interval', '$q', function ($scope, Upload, $timeout, $interval, $q) {


///////////////////////////////////////模板套红////////////////////////////////////////
    var newsFiles = query("GM_getNewsTemplateParams");
// console.log(noticeFiles);
    $scope.newsFiles = newsFiles;

///////////////////////////////////// 动态获取模板的id进行下载//////////////////////////////////////////
    $scope.downloadTemplate = function (newsId) {
        var url = "/suite/doc/" + newsId;
        TANGER_OCX_OBJ.AddTemplateFromURL(url);
    }


    var vm = this;
    vm.cancel = cancel;
    vm.rejectIt = false;
    var forums = query("GM_getNewForums", {});
    $scope.isClose = true;
    $scope.isOpen = false;
    $scope.showSelect = true;
    $scope.forums = forums;
    $scope.uploadFiles = function (files, errFiles) {
        $scope.files = files;
        $scope.errFiles = errFiles;
        angular.forEach(files, function (file) {
            file.upload = Upload.upload({
                url: '/suite/plugins/servlet/UploadFile',
                data: {filePath: "默认社区/临时文件知识中心/新闻附件"},
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
                    totalFiles.push(file);
                    atarchId.push(data[0].id);
                });
                $scope.files = totalFiles;
            }).error(function (data, status, headers, config) {
                //上传失败
                console.log('error status: ' + status);
            });
        });
        var main = $(window.parent.document).find("#processModelContent");
        var thisheight = $(document).height() + 50;
        main.height(thisheight);
    }
    $scope.updateImage = function (file, file1) {
        execute("GM_deleteDocument", {fileId: file1.field});
        $scope.file = file;
        file.upload = Upload.upload({
            url: '/suite/plugins/servlet/UploadFile',
            data: {filePath: "默认社区/临时文件知识中心/新闻附件"},
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
            url: '/suite/plugins/servlet/UploadFile',
            data: {filePath: "默认社区/临时文件知识中心/新闻附件"},
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
    // $scope.submit = function () {
    //     var newsName = $("#newsName").val();
    //     var newsContent = $("#newsName").val();
    //     var newsType = $("#newsType").val();
    //     if (!newsName || !newsContent || !newsType) {
    //         mini.showTips({
    //             content: "<b>失败</b> <br/>请完成表单内容再提交！",
    //             state: "danger",
    //             x: "center",
    //             y: "center",
    //             timeout: 2000
    //         });
    //         return;
    //     } else {
    //         var data = {
    //             newsName: newsName,
    //             newsContent: newsContent,
    //             newsType: newsType,
    //             imgId: imgId,
    //             atarchId: atarchId.join("!"),
    //             contentId: contentId.join("!")
    //         };
    //         //alert(mini.encode(data));
    //         var progressId = startProcessNews("0002ddc4-12b3-8000-9e06-010000010000", {formData: mini.encode(data)});
    //     }
    // }
    $scope.submit = function () {
        var newsName = $("#newsName").val();
        var newsContent = $("#newsName").val();
        var newsType = $("#newsType").val();
        if (!newsName || !newsContent || !newsType) {
            mini.showTips({
                content: "<b>失败</b> <br/>请完成表单内容再提交！",
                state: "danger",
                x: "center",
                y: "center",
                timeout: 2000
            });
            return;
        } else {
            var str=UE.getEditor('UEditor').getAllHtml();
            var fileTime = new Date().getTime();
            var dataa={filePath:"默认社区/临时文件知识中心/新闻附件",filename:"upload"+fileTime+".html",filevalue:str};
            $.ajax({
                url: "/suite/plugins/servlet/UploadHtmlStr",
                type:"post",
                data:dataa,
                async:true,
                success: function (rs) {
                    contentId = [];
                    rs = eval("(" + rs + ")");
                    // console.log(rs);
                    if (rs.length > 0) {

                        for (var i = 0; i < rs.length; i++) {
                            if (foundArrayIndex(doc_ob_id, rs[i].id)) {
                                execute("GM_deleteDocument", {fileId: rs[i].id});
                                totalFiles = getArrayIndex(totalFiles, rs[i].id);
                            }
                        }
                        $scope.files = totalFiles;
                        doc_ob_id = [];
                        for (var j = 0; j < rs.length; j++) {
                            doc_ob_id.push(rs[j].id);
                            var file = {};
                            file["field"] = rs[j].id;
                            file["status"] = 200;
                            file["size"] = rs[j].size;
                            file["progress"] = 100;
                            file["name"] = rs[j].name + "." + rs[j].suffix;
                            file["version"] = rs[j].version;
                            totalFiles.push(file);
                            contentId.push(rs[j].id);
                            var data = {
                                newsName: newsName,
                                newsContent: newsContent,
                                newsType: newsType,
                                imgId: imgId,
                                atarchId: atarchId.join("!"),
                                contentId: contentId.join("!")
                            };
                            var progressId = startProcessNews("0002ddc4-12b3-8000-9e06-010000010000", {formData: mini.encode(data)});
                            // console.log(mini.encode(data));
                        }
                        $scope.files = totalFiles;
                    };

                },
                error: function () {
                    
                }
            });

        }
                
    }

    $scope.saveDocument = function () {
        contentId = [];
        if (doc_ob_id.length > 0) {
            for (var k = 0; k < doc_ob_id.length; k++) {
                totalFiles.splice(foundArrayIndexNum(totalFiles, doc_ob_id[k]), 1);
            }
        }
        var pdfname = new Date().getTime() + "新闻附件(" + mini.formatDate(new Date(), 'yyyy-MM-dd') + ").html";

        if (browser == "IE") {
            TANGER_OCX_OBJ.ActiveDocument.WebOptions.Encoding = 65001;
            var data = TANGER_OCX_OBJ.PublishAsHTMLToURL("/suite/plugins/servlet/UploadFile", "uploadHtml", "filePath=默认社区/临时文件知识中心/新闻附件", pdfname);
            data = eval("(" + data + ")");
            if (data.length > 0) {

                for (var i = 0; i < data.length; i++) {
                    if (foundArrayIndex(doc_ob_id, data[i].id)) {
                        execute("GM_deleteDocument", {fileId: data[i].id});
                        totalFiles = getArrayIndex(totalFiles, data[i].id);
                    }
                }
                $scope.files = totalFiles;
                doc_ob_id = [];
                for (var j = 0; j < data.length; j++) {
                    doc_ob_id.push(data[j].id);
                    var file = {};
                    file["field"] = data[j].id;
                    file["status"] = 200;
                    file["size"] = data[j].size;
                    file["progress"] = 100;
                    file["name"] = data[j].name + "." + data[j].suffix;
                    file["version"] = data[j].version;
                    totalFiles.push(file);
                    contentId.push(data[j].id);
                }
                $scope.files = totalFiles;
            }
        } else {
            TANGER_OCX_OBJ.ActiveDocument.WebOptions.Encoding = 65001;
            TANGER_OCX_OBJ.PublishAsHTMLToURL("/suite/plugins/servlet/UploadFile", "uploadHtml", "filePath=默认社区/临时文件知识中心/新闻附件", pdfname);
            var timer = $interval(function () {
                doAsync(vm.rejectIt).then(function (data) {
                    console.log(data.resolveData);
                }, function (error) {
                    console.log(error.rejectData);
                });
            }, 600, 5);
            timer.then(success, error, notify);
        }
        var main = $(window.parent.document).find("#processModelContent");
        var thisheight = $(document).height() + 500;
        main.height(thisheight);
    }


    // 保存文本
    $scope.saveAsHtml = function(){
        var str=UE.getEditor('UEditor').getAllHtml();
        var data={filePath:"默认社区/临时文件知识中心/新闻附件",filename:"upload.html",filevalue:str};  
        $.ajax({
            url: "/suite/plugins/servlet/UploadHtmlStr",
            type:"post",
            data:data,
            async:true,
            success: function (rs) {
                mini.showTips({
                    content: "<b>成功</b> <br/>文本保存成功",
                    state: "success",
                    x: "center",
                    y: "center",
                    timeout: 2000
                })
                console.log(rs);
            },
            error: function () {
                mini.showTips({
                    content: "<b>失败</b> <br/>文本保存失败",
                    state: "danger",
                    x: "center",
                    y: "center",
                    timeout: 2000
                });
                
            }
        });
    }



    function doAsync(rejectIt) {
        return $q(function (resolve, reject) {
            var doneTime = +new Date();
            // console.log(doneTime);
            if (!rejectIt) {
                if (data_info.length > 0) {
                    vm.rejectIt = !vm.rejectIt;
                    for (var i = 0; i < data_info.length; i++) {
                        if (foundArrayIndex(doc_ob_id, data_info[i].id)) {
                            execute("GM_deleteDocument", {fileId: data_info[i].id});
                            totalFiles = getArrayIndex(totalFiles, data_info[i].id);
                        }
                    }
                    $scope.files = totalFiles;
                    doc_ob_id = [];
                    for (var j = 0; j < data_info.length; j++) {
                        doc_ob_id.push(data_info[j].id);
                        var file = {};
                        file["field"] = data_info[j].id;
                        file["status"] = 200;
                        file["size"] = data_info[j].size;
                        file["progress"] = 100;
                        file["name"] = data_info[j].name + "." + data_info[j].suffix;
                        file["version"] = data_info[j].version;
                        totalFiles.push(file);
                        contentId.push(data_info[j].id);
                    }
                    $scope.files = totalFiles;
                }
            } else {
                reject({
                    rejectData: 'reject it at ' + doneTime
                });
            }
        });
    }

    function success() {
        vm.rejectIt = !vm.rejectIt;
        console.log("done");
    }

    function error() {
        console.log("cancelled or error");
    }

    function notify() {
        console.log("updating");
    }


    function cancel() {
        $interval.cancel(timer);
    }

    function startProcessNews(uuid, data) {
        $("body").append("<div  style='top:0px;left:0px;position:absolute;width:100%;height:100%;filter:alpha(Opacity=80);-moz-opacity:0.5;opacity: 0.5;z-index:100; background-color:#ffffff;' ><img src='/suite/plugins/img/loading/loading.gif' style='position:absolute;left:48%;top:10%;width:40px;height:40px;' /></div>")
        data["uuid"] = uuid;
        var messageid = mini.loading("新闻发布中...", "Loading");
        $.ajax({
            url: "/suite/plugins/servlet/SetProcessActiveVariable",
            type: "post",
            data: data,
            async: false,
            success: function (rs) {
                if (rs != null && rs != "") {
                    mini.showTips({
                        content: "<b>成功</b> <br/>新闻发布成功",
                        state: "success",
                        x: "center",
                        y: "top",
                        timeout: 6000
                    })
                    setTimeout(function () {
                        mini.hideMessageBox(messageid);
                        window.parent.location.href = "/suite/plugins/servlet/web/index.html#/nonfometNews";
                        window.parent.location.reload();
                    }, 5000);

                }
            },
            error: function () {
                mini.showTips({
                    content: "<b>失败</b> <br/>新闻发布失败",
                    state: "danger",
                    x: "center",
                    y: "center",
                    timeout: 2000
                });
            }
        });

    }

    function getArrayIndex(arr, doc_id) {
        var newArr = [];
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i].field != doc_id) {
                newArr.push(arr[i]);
            }
        }
        return newArr;
    }

    function foundArrayIndex(arr, foundVal) {
        var found = false;
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i] == foundVal) {
                found = true;
            }
        }
        return found;
    }


    function foundArrayIndexNum(arr, foundVal) {
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i].field == foundVal) {
                return i;
            } else {
                return -1;
            }
        }
    }

    $scope.remove = function (file) {

        $scope.files.splice($scope.files.indexOf(file), 1);
        execute("GM_deleteDocument", {fileId: file.field});
        if (file.field == doc_ob_id) {
            doc_ob_id = "";
        }
        atarchId.splice(atarchId.indexOf(file.field), 1);
    }

    $scope.removeAll = function (files) {
        totalFiles = [];
        $scope.files = totalFiles;
        angular.forEach(files, function (file) {
            execute("GM_deleteDocument", {fileId: file.field});

        });
        doc_ob_id = "";
        contentId = [];
        atarchId = [];
    }

    $scope.download = function (file) {

        try {
            var elemIF = document.createElement("iframe");
            elemIF.src = '/suite/doc/' + file.field;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        } catch (e) {

        }

        //window.open ('/suite/doc/'+file.field,'附件下载','height=100,width=400,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no')
    }
}]);
function OnPublishAsHtmlToUrl(type, code, html) {
    // console.log(1);
    data_info = [];
    TANGER_OCX_OBJ.ShowTipMessage("新闻状态", "发布成功！！", false);
    data_info = eval("(" + html + ")");
    // console.log(data_info);
}

function openWordNew() {

    OpenTestDoc('/suite/plugins/servlet/loadsource/8958/news.doc');
}
function addd() {
    TANGER_OCX_OBJ.AddMultiPicFromLocal();
}
function togglefullscreen() {
    $('#noteditor').toggleClass('fullscreen');
    if ($('noteditor').hasClass('fullscreen')) {
        $('#editorBody').height(1200);
    } else {
        $('#editorBody').height(600);
    }
}

