var forumId = "";
var forumName = "";
mini.parse();
var userInfo = query("GM_getloginUserInfo", {})[0];
var userName = userInfo.firstName == "" ? userInfo.userName : userInfo.firstName;
var grid = mini.get("datagrid1");
var adminFunc = false;
angular.module('MaterialApp')
    .controller('documentCtr', ['$scope', '$stateParams', '$state', '$rootScope', function ($scope, $stateParams, $state, $rootScope) {
        forumId = $stateParams.forumId;
        forumName = $stateParams.forumName;
        if (forumName) {
            $("#headText").html(forumName)
        }
        $scope.lookDetails = function (threadId) {
            $state.go('nonfometNewsDetail', {threadId: threadId, forumId: forumId});
        };

        adminFunc = $rootScope.adminFunc;
        grid.set({showPager: true, sizeList: [20, 50, 100, 500, 1000], pageSize: 20});
        grid.setUrl("/suite/plugins/servlet/query/GM_getAllThreadPaging");
        grid.on("load", function () {
        });


        if (forumId) {
            grid.load({threadId: forumId});

        } else {
            grid.load({threadId: 0});
        }

        $scope.reloadPage = function () {
            $state.reload();
        }
    }]);


function onActionRenderer(e) {
    var grid = e.sender;
    var record = e.record;
    //var s = '<a class="btn blue btn-xs"  href="javascript:void(0)" onclick="openWin('+record.threadId+')" >查看<i class="fa fa-search"></i></a>';
    var s = '';
    if (record.ThreadCreatorName == userName || adminFunc || userName == 'Administrator') {
        s = '<a class="btn red btn-xs"  href="javascript:void(0)" onclick="deleteThread(' + record.threadId + ')" >删除<i class="fa fa-times"></i></a>';
    }
    return s;
}


function doFilter1() {
    var name = $("#searchBox").val();
    //多条件组合过滤
    grid.filter(function (row) {

        //subject
        var r1 = true;
        if (name) {
            r1 = String(row.subject).indexOf(name) != -1;
        }
        var r2 = true;
        if (name) {
            r2 = String(row.customField3).indexOf(name) != -1;
        }

        var r3 = true;
        if (name) {
            r3 = String(row.ThreadCreatorName).indexOf(name) != -1;
        }
        return r1 || r2 || r3;
    });

}

grid.on("drawcell", function (e) {
    var record = e.record,
        column = e.column,
        field = e.field,
        value = e.value;
    if (field == "subject") {
        if (!record.isRead) {
            e.cellStyle = "text-align:center;font-weight:bolder;color:blue;";
        } else {
            e.cellStyle = "text-align:center;font-weight:lighter;color:blue;";
        }
        //e.cellHtml = '<a href="#/nonfometAnnouncementDetail/' + record.threadId + '">'+value+'</a>';
        e.cellHtml = '<a href="javascript:void(0)" onclick="openWin(' + record.threadId + ')">' + value + '</a>';
    } else if (field == "ThreadCreatorName") {
        var userName = record.ThreadCreatorName == "" ? record.ThreadCreator : record.ThreadCreatorName;
        if (record.ThreadCreator == userInfo.userName) {
            e.cellHtml = '<img src="/suite/plugins/servlet/loadsource/3/' + userInfo.userName + '.png" style="border-radius:2px;" width="30"><a href="/suite/plugins/web/index.html#/profile/dashboard" style="text-decoration:none;color: #428BCA;">' + userName + '</a>';
        } else {
            e.cellHtml = '<img src="/suite/plugins/servlet/loadsource/3/' + record.ThreadCreator + '.png" style="border-radius:2px;" width="30"><a href="/suite/plugins/web/index.html#/userProfile/' + record.ThreadCreator + '" style="text-decoration:none;color: #428BCA;">' + userName + '</a>';
        }
    }
        else if(field == "body"){
            e.cellHtml='<span>' + value.split("T")[0]+ '</span>';
        }

});
function openWin(id) {
    $('.inbox-nav > li.active').removeClass('active');
    window.location.href = "/suite/plugins/web/index.html#/accounmentRead/accounmentView/" + id;
}

function deleteThread(threadId) {
    bootbox.confirm({
        title:'消息提示:',
        message: "确定该删除记录?",
        buttons: {
            confirm: {
                label: '确定',
                className: 'btn-success'
            },
            cancel: {
                label: '取消',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if(result) {
                var deFlag = execute("GM_deleteThreadById", {threadId: threadId});
                if (deFlag == "true") {
                    if (!forumId) {
                        forumId = 0;
                    }
                    grid.load({threadId: forumId});
                }
            }
        }
    });

}
