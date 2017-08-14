angular.module('MaterialApp').controller('newsDetailController', ['$scope', '$state', '$stateParams', '$timeout', '$rootScope', function ($scope, $state, $stateParams, $timeout, $rootScope) {

    $scope.reloadPage = function () {

        $state.reload();
    }


    $scope.userInfo = $rootScope.userInfo;

    var threadId = $stateParams.threadId;
    var data = {threadId: threadId, subject: "阅读", messageBody: "阅读"};
    startProcessMessage("0003ddce-2e3c-8000-9e06-010000010000", {formData: mini.encode(data)});
    var newsFasts = query("GM_getNewsFastTopicByNum");
    $scope.newsFasts = newsFasts;
    var threadSummry = query("GM_getNewsFastTopicSummry", {threadId: threadId})[0];
    var forums = query("GM_getNewForums", {});
    $scope.threadSummry = threadSummry;

    // console.log($scope.threadSummry);
    $scope.forums = forums;
    // alert(mini.encode(threadSummry.attachments));
    // console.log(mini.encode(threadSummry.attachments));
    // console.log(threadSummry);
    //var attachs=$scope.threadSummry.attachments;
    //var attachNum=$scope.attachNum=attachs.length;
    //$scope.attachs=attachs;
    //var attachs=$scope.attachs=[];
    //angular.forEach(newattachs, function(data){
    //	if(data.attachmentImage=="no"&&data.suffix!="html"&&data.fileName.indexOf("news")<0){
    //	$scope.attachNum+=$scope.attachNum;
    //	$scope.attachs.push(data);
    //	}
    //});
    //alert(mini.encode($scope.attachs));

    //点击人名跳转到相应个人信息页面
    var openUserInofUrl = "";
    if (threadSummry.creator == $scope.userInfo.userName) {
        openUserInofUrl = "/suite/plugins/web/index.html#/profile/dashboard";

    } else {
        openUserInofUrl = "/suite/plugins/web/index.html#/userProfile/" + threadSummry.creator;

    }
    $scope.openUserInofUrl = openUserInofUrl;


    // 把内容为空的附件去掉后的附件长度
    $scope.getAttachmentLength = function (threadSummry) {
        var newAttachments = [];
        for (var i = 0; i < threadSummry.attachments.length; i++) {
            if (threadSummry.attachments[i].attachmentId != "null" && threadSummry.attachments[i].fileName.indexOf("新闻附件(") < 0) {
                newAttachments.push(threadSummry.attachments[i]);
            }
        }
        return newAttachments.length;
    }


    $scope.getSrc = function (attach) {
        var srcUrl = "";
        if (attach.length > 0) {
            for (var i = 0; i < attach.length; i++) {
                if (attach[i].attachmentImage == "yes") {
                    srcUrl = "/suite/doc/" + attach[i].attachmentId;
                }
                // console.log(attach[i]);
            }
        }

        if (!srcUrl) {
            srcUrl = "/suite/plugins/metronic/theme/assets/pages/img/page_general_search/2.jpg";
        }
        return srcUrl;
    }

    $scope.submitMessage = function (thread) {
        var messageBody = $("#messageBody").val();
        var data = {threadId: thread, subject: "评论", messageBody: messageBody};
        startProcessNews("0003ddce-2e3c-8000-9e06-010000010000", {formData: mini.encode(data)});
        $timeout(function () {
            var threadSummry = query("GM_getNewsFastTopicSummry", {threadId: threadId})[0];
            $scope.threadSummry = threadSummry;
        }, 3000)

    }

    $scope.searchThread = function (forumId, evt) {
        var threadSearch = evt.target.value;
        var newsFasts = query("GM_getThreadSearch", {forumId: forumId, subject: threadSearch});
        $scope.newsFasts = newsFasts;
    }

    $scope.getIframSrc = function (attach) {
        var srcUrl1 = "";
        if (attach.length > 0) {
            for (var i = 0; i < attach.length; i++) {
                if (attach[i].suffix == "html") {
                    return "/suite/plugins/servlet/loadsource/3866/" + attach[i].fileName + ".html";
                }
            }
        }
        return srcUrl1;
    }

    $scope.lookDetails = function (forumId) {
        $state.go('nonfometNewsSearch', {forumId: forumId});
    };


    $scope.myFilter = function (item) {
        return item.messageBody != "阅读";
    };

    $scope.myFilterAttach = function (item) {
        return item.attachmentImage != "yes";
    };

    $scope.updateThread = function (threadId) {
        var newthreadSummry = query("GM_getNewsFastTopicSummry", {threadId: threadId})[0];
        $scope.threadSummry = newthreadSummry;
    }
}]);

function startProcessNews(uuid, data) {
    //$("body").append("<div  style='top:0px;left:0px;position:absolute;width:100%;height:100%;filter:alpha(Opacity=80);-moz-opacity:0.5;opacity: 0.5;z-index:100; background-color:#ffffff;' ><img src='/suite/plugins/img/loading/loading.gif' style='position:absolute;left:48%;top:10%;width:40px;height:40px;' /></div>")
    data["uuid"] = uuid;
    $.ajax({
        url: "/suite/plugins/servlet/SetProcessActiveVariable",
        type: "post",
        data: data,
        async: false,
        success: function (rs) {
            console.log(rs);
        },
        error: function () {
            alert("评论发送失败,请联系管理员！")
        }
    });

}


var browserVersion = window.navigator.userAgent.toUpperCase();
var isOpera = browserVersion.indexOf("OPERA") > -1 ? true : false;
var isFireFox = browserVersion.indexOf("FIREFOX") > -1 ? true : false;
var isChrome = browserVersion.indexOf("CHROME") > -1 ? true : false;
var isSafari = browserVersion.indexOf("SAFARI") > -1 ? true : false;
var isIE = (!!window.ActiveXObject || "ActiveXObject" in window);
var isIE9More = (!-[1,] == false);
function reinitIframe(iframeId, minHeight) {
    try {
        var iframe = document.getElementById(iframeId);
        var bHeight = 0;
        if (isChrome == false && isSafari == false)
            bHeight = iframe.contentWindow.document.body.scrollHeight;

        var dHeight = 0;
        if (isFireFox == true)
            dHeight = iframe.contentWindow.document.documentElement.offsetHeight + 2;
        else if (isIE == false && isOpera == false)
            dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
        else if (isIE == true && isIE9More) {//ie9+
            var heightDeviation = bHeight - eval("window.IE9MoreRealHeight" + iframeId);
            if (heightDeviation == 0) {
                bHeight += 3;
            } else if (heightDeviation != 3) {
                eval("window.IE9MoreRealHeight" + iframeId + "=" + bHeight);
                bHeight += 3;
            }
        }
        else//ie[6-8]、OPERA
            bHeight += 3;

        var height = Math.max(bHeight, dHeight);
        if (height < minHeight) height = minHeight;
        iframe.style.height = height + "px";
    } catch (ex) {
    }
}
function startInit(iframeId, minHeight) {
    eval("window.IE9MoreRealHeight" + iframeId + "=0");
    window.setInterval("reinitIframe('" + iframeId + "'," + minHeight + ")", 100);
}
startInit('mainFrame', 560);

function startProcessMessage(uuid, data) {
    //$("body").append("<div  style='top:0px;left:0px;position:absolute;width:100%;height:100%;filter:alpha(Opacity=80);-moz-opacity:0.5;opacity: 0.5;z-index:100; background-color:#ffffff;' ><img src='/suite/plugins/img/loading/loading.gif' style='position:absolute;left:48%;top:10%;width:40px;height:40px;' /></div>")
    data["uuid"] = uuid;
    $.ajax({
        url: "/suite/plugins/servlet/SetProcessActiveVariable",
        type: "post",
        data: data,
        async: true,
        success: function (rs) {
            console.log(rs);
        },
        error: function () {
            alert("流程提交失败,请联系管理员！")
        }
    });

}
