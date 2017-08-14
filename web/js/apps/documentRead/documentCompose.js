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

var editContent = "";
$(function () {
    $('#summernote_1').summernote({
        height: 300,
        lang: 'zh-CN'
    });
    $('#summernote_1').on('summernote.change', function (we, contents, $editable) {
        editContent = contents;
    });
});

var doc_ob_id = [];
var imgId = "";
var contentId = [];
var atarchId = [];
var app = angular.module('MetronicApp1', ['ngFileUpload']);
var totalFiles = [];
app.controller('newsAddController', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
    $scope.isClose = true;
    $scope.isOpen = false;
    $scope.showSelect = true;
    $scope.uploadFiles = function (files, errFiles) {
        $scope.files = files;
        $scope.errFiles = errFiles;
        angular.forEach(files, function (file) {
            file.upload = Upload.upload({
                url: '/suite/plugins/servlet/UploadFile',
                data: {filePath: "默认社区/临时文件知识中心/文件传阅"},
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
                });
                $scope.files = totalFiles;
            }).error(function (data, status, headers, config) {
                //上传失败
                console.log('error status: ' + status);
            });
        });
    }

    $scope.remove = function (file) {

        $scope.files.splice($scope.files.indexOf(file), 1);
        totalFiles = $scope.files;
        execute("GM_deleteDocument", {fileId: file.field});
    }

    $scope.removeAll = function (files) {
        totalFiles = [];
        $scope.files = totalFiles;
        angular.forEach(files, function (file) {
            execute("GM_deleteDocument", {fileId: file.field});
        });
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


function getFormData() {
    var subject = $("#subject").val();
    var summerCode = $('#summernote_1').summernote('code');
    var receivePeo = mini.get("readPeo").getValue();
    var newtotalFiles = getNewTotalFiles(totalFiles);
    var atarchNum = newtotalFiles.length;
    var data = {
        "files": mini.encode(newtotalFiles),
        "subject": subject,
        "summerCode": summerCode,
        "receivePeo": receivePeo,
        "atarchId": atarchNum
    };
    return data;
}

function submitFo() {
    var data = getFormData();
    var progressId = startProcessNews("0002ddf6-24be-8000-9e06-010000010000", {formData: mini.encode(data)});
}

function getNewTotalFiles(toFiles) {
    var toNewFiles = [];
    for (var i = 0; i < toFiles.length; i++) {
        var nwData = {
            "name": toFiles[i].name,
            "progress": toFiles[i].progress,
            "field": toFiles[i].field,
            "status": toFiles[i].status,
            "version": toFiles[i].version,
            "size": toFiles[i].size,
            "type": toFiles[i].type,
            "lastModified": toFiles[i].lastModified
        };
        toNewFiles.push(nwData);
    }
    return toNewFiles;
}

function startProcessNews(uuid, data) {

    //add by Chris
    var titleVal = $("#subject").val();
    if (titleVal == null || titleVal == "") {
        mini.showTips({
            content: "<b>提示</b> <br/>请添加标题！",
            state: "danger",
            x: "center",
            y: "center",
            timeout: 2000
        });
        return;
    }
    // end
    //$("body").append("<div  style='top:0px;left:0px;position:absolute;width:100%;height:100%;filter:alpha(Opacity=80);-moz-opacity:0.5;opacity: 0.5;z-index:100; background-color:#ffffff;' ><img src='/suite/plugins/img/loading/loading.gif' style='position:absolute;left:48%;top:10%;width:40px;height:40px;' /></div>")
    data["uuid"] = uuid;
    var messageid = mini.loading("传阅发起中...", "Loading");
    $.ajax({
        url: "/suite/plugins/servlet/SetProcessActiveVariable",
        type: "post",
        data: data,
        async: false,
        success: function (rs) {
            if (rs != null && rs != "") {
                mini.showTips({
                    content: "<b>成功</b> <br/>传阅发起成功",
                    state: "success",
                    x: "right",
                    y: "center",
                    timeout: 6000
                });
                setTimeout(function () {
                    mini.hideMessageBox(messageid);
                    window.parent.location.href = "/suite/plugins/web/index.html#/documentRead/documentRecord/5";
                    window.parent.location.reload();
                }, 4000);
            }
        },
        error: function () {
            mini.showTips({
                content: "<b>失败</b> <br/>传阅发起失败",
                state: "danger",
                x: "center",
                y: "center",
                timeout: 2000
            });
        }
    });

}


mini.parse();
mini.get("readPeo").on("focus", onButtonEdit1);
function removeGroup() {
    mini.get("readGroup").setValue("");
    mini.get("readGroup").setText("");
}
function removePeo() {
    mini.get("readPeo").setValue("");
    mini.get("readPeo").setText("");
}
function onButtonEdit1(e) {
    var btnEdit = mini.get("readPeo");
    var wi = Number($(document.body).width());
    var hi = Number($(document.body).height()) - 100;
    mini.open({
        url: "/suite/plugins/servlet/loadsource/3608/selectUserTree.html",
        title: "北京科园组织架构选人",
        width: wi,
        height: hi,
        allowResize: true,
        allowDrag: true,
        showCloseButton: true,
        showMaxButton: true,
        onload: function () {
            var iframe = this.getIFrameEl();
            var datat = [];
            var arr = [];
            var drr = [];
            var val = mini.get("readPeo").getValue();
            var tex = mini.get("readPeo").getText();
            if (val) {
                if (val.indexOf("!") != -1) {
                    arr = val.split("!");
                    drr = tex.split("!")
                } else {
                    arr.push(val);
                    drr.push(tex);
                }
            }
            for (var i = 0; i < arr.length; i++) {
                var newD = {userName: arr[i], firstName: drr[i]};
                datat.push(newD);
            }
            iframe.contentWindow.SetData(datat);
        },
        ondestroy: function (action) {

            if (action == "ok") {
                var iframe = this.getIFrameEl();

                var data = iframe.contentWindow.GetData();
                data = mini.clone(data);

                btnEdit.setValue(data.id);
                btnEdit.setText(data.text);
            }
        }
    });

}


// 自己加的返回
var backto = function () {
        window.parent.location.href = "/suite/plugins/web/index.html#/documentRead/documentInbox/0";
    }
