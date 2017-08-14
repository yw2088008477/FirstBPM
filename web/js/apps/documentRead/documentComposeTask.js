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
mini.parse();
function onButtonEdit(e) {
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
mini.get("readPeo").on("focus", onButtonEdit1);
// mini.get("readGroup").on("focus",onButtonEdit);
// function removeGroup(){
// mini.get("readGroup").setValue("");
// mini.get("readGroup").setText("");
// }
function removePeo() {
    mini.get("readPeo").setValue("");
    mini.get("readPeo").setText("");
}
function onButtonEdit1(e) {
    var btnEdit = mini.get("readPeo");
    mini.open({
        url: "/suite/plugins/servlet/loadsource/3691/selectUsers.html",
        width: 650,
        height: 380,
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

var atarchId = [];
var app = angular.module('MetronicApp1', ['ngFileUpload']);
var totalFiles = [];
var processId = "";
var taskId = "";
app.controller('newsAddController', ['$scope', 'Upload', '$timeout',$rootScope, function ($scope, Upload, $timeout,$rootScope) {

    // var userInfo = query("GM_getloginUserInfo", {});
    var userInfo=$rootScope.userInfo;
    var userName = userInfo.firstName == "" ? userInfo.userName : userInfo.firstName;
    var dept = userInfo.customField2 == "" ? "运营管理部" : userInfo.customField2;
// alert(document.location.href);
    taskId = decodeURIComponent(document.location.href.substring(document.location.href.indexOf("?") + 8, document.location.href.length));


    var pp = {};
    var pv = {};
    var tp = query("gettaskdetails", {id: taskId})[0];
    processId = tp.processId;
    var owner = tp.owner;
    var assignes = tp.assignees;
    pp = query("getprocessdetails", {id: processId})[0];
    pv = query("getprocessvariables", {id: processId})[0];
    $("#viewContent").append(pv.summerCode);
    var conttent = pv.summerCode;
    $('#summernote_1').summernote({
        height: 300,
        minHeight: 300,
        maxHeight: 500,
        lang: 'zh-CN'
    });
    var readedPeo = "";
    var unreadPeo = pv.unreadPeo;
    var receive = pv.groupUsers;
    if (!unreadPeo) {
        unreadPeo = removeUser(receive, "");
    }
    if (owner && owner != "") {
        readedPeo = pv.readedPeo;
        if (readedPeo) {
            if (readedPeo.indexOf(owner) == -1) {
                if (readedPeo.indexOf("!") > 0) {
                    readedPeo = readedPeo + owner + "!";
                } else {
                    readedPeo = owner + "!";
                }
            }
        } else {
            readedPeo = owner + "!";
        }
        if (unreadPeo) {
            if (unreadPeo.indexOf("!") > 0) {
                unreadPeo = removeUserUn(unreadPeo, owner);
            }
        }
        var newD = {readedPeo: readedPeo, unreadPeo: unreadPeo};
        execute("updateprocessvariables", {id: processId, tv: mini.encode(newD)});
    }
    var peoDatas = query("GM_getReadUserName", {readedPeo: readedPeo, unreadPeo: unreadPeo});
    var peoData = "";
    if (peoDatas != "" && peoDatas != "undefined" && peoDatas != undefined) {
        if (peoDatas.length > 0) {
            peoData = peoDatas[0];
        }
    }

    //alert(mini.encode(pv));
    // console.log(peoData);
    setFormData(pv, peoData);
    function removeUser(data, text) {
        var newArr = [];
        for (var j = 0; j < data.length; j++) {
            if (data[j] != text) {
                newArr.push(data[j]);
            }
        }
        return newArr.join("!");
    }

    function removeUserUn(data, text) {
        var arr = data.split("!");
        var newArr = [];
        for (var j = 0; j < arr.length; j++) {
            if (arr[j] != text) {
                newArr.push(arr[j]);
            }
        }
        return newArr.join("!");
    }

    function setFormData(data, pt) {
        $("#subject").val(data.subject);
        $("#readedPP").html(pt.readed);
        $("#unreadPP").html(pt.unread);
    }


// 已读未读人员
    var dataRead = [];
    var dataUnread = [];
// 中文名
    if (peoData != "") {
        var read = peoData.readed.split(";");
        var unread = peoData.unread.split(";");
        var eRead = pv.readedPeo.split("!");
        var eUnread = pv.unreadPeo.split("!");
        for (var i = 0; i < read.length; i++) {
            if (read[i] != "" && eRead[i] != "") {
                var target1 = {userName: eRead[i], chineseName: read[i]};
                dataRead.push(target1);
            }
        }
        for (var i = 0; i < unread.length; i++) {
            if (eUnread[i] != "" && unread[i] != "") {
                var target2 = {userName: eUnread[i], chineseName: unread[i]};
                dataUnread.push(target2);
            }
        }
    }

// 拼音名

// console.log(dataRead);
// console.log(dataUnread);
    $scope.dataReads = dataRead;
    $scope.dataUnreads = dataUnread;

// 已读未读人员结束


    totalFiles = mini.decode(pv.files);
    $scope.isClose = true;
    $scope.isOpen = false;
    $scope.showSelect = true;
    $scope.showFlag = false;
    $scope.files = totalFiles;
    $scope.tp = tp;
    $scope.pv = pv;


// console.log(totalFiles);


    $('#summernote_1').summernote('code', conttent);
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
        var main = $(window.parent.document).find("#taskContent");
        var thisheight = $(document).height() + 50;
        main.height(thisheight);
    }
    $scope.showDocument = function () {

        $scope.showFlag = true;
        var main = $(window.parent.document).find("#taskContent");
        var thisheight = $(document).height() + 250;
        main.height(thisheight);
    }

    $scope.hideDocument = function () {
        $scope.showFlag = false;
        var main = $(window.parent.document).find("#taskContent");
        var thisheight = $(document).height();
        main.height(thisheight);
    }

// $scope.getReadedHeight = function(){

//     var main = $(window.parent.document).find("#taskContent");
//     var thisheight = $(document).height();
//     main.height(thisheight);
// }

// $scope.getUnreadedHeight = function(){
//     var main = $(window.parent.document).find("#taskContent");
//     var thisheight = $(document).height();
//     main.height(thisheight);
// }


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
    }
}]);
function submitFo() {
    var data = getFormData("转发");
    execute("updateprocessvariables", {id: processId, tv: mini.encode(data)});
    // submit(taskId,{formData:mini.encode(data)});
    submitCompleted(taskId, {formData: mini.encode(data)});
}

function submitF() {
    var data = getFormData("完成");
    execute("updateprocessvariables", {id: processId, tv: mini.encode(data)});
    // submit(taskId,{formData:mini.encode(data)});
    submitCompleted(taskId, {formData: mini.encode(data)});
}


function submitCompleted(id, data) {
    $("body").append("<div  style='top:0px;left:0px;position:absolute;width:100%;height:100%;filter:alpha(Opacity=80);-moz-opacity:0.5;opacity: 0.5;z-index:100; background-color:#ffffff;' ><img src='/suite/plugins/img/loading/loading.gif' style='position:absolute;left:48%;top:10%;width:40px;height:40px;' /></div>")
    data["activityId"] = id;
    data["isSubmit"] = true;

    $.ajax({
        url: "/suite/plugins/servlet/SetTaskActiveVariable",
        type: "post",
        data: data,
        async: false,
        success: function (text) {
            if (text == "0") {
                alert("任务提交失败,请联系管理员！")
            } else if (text == "1") {
                //history.back(-1);
                setTimeout(
                    function () {

                        window.top.location = "/suite/plugins/web/index.html?random=" + Math.random() + "#/documentRead/documentInbox/0";

                    }
                    , 500);
            } else {
                setTimeout(
                    function () {
                        window.top.location = "/suite/plugins/web/index.html#/publishRead/publishRecord/5";
                    }
                    , 500);
                //window.location.href="/suite/plugins/servlet/viewtaskdetails?taskid="+text;
            }
        },
        error: function () {
            alert("任务提交失败,请联系管理员！")
        }
    });

}


function getFormData(type) {
    var subject = $("#subject").val();
    var summerCode = $('#summernote_1').summernote('code');
    // var receiveGroup=mini.get("readGroup").getValue();
    var receivePeo = mini.get("readPeo").getValue();
    var newtotalFiles = getNewTotalFiles(totalFiles);
    var atarchNum = newtotalFiles.length;
    var data = {
        "files": mini.encode(newtotalFiles),
        "subject": subject,
        "summerCode": summerCode,
        "receivePeo": receivePeo,
        "submitFlag": type,
        "atarchId": atarchNum
    };
    return data;
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

