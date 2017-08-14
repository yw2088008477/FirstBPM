mini.parse();
var userInfo = query("GM_getloginUserInfo", {})[0];
var userName = userInfo.firstName == "" ? userInfo.userName : userInfo.firstName;
var grid = mini.get("datagrid1");
var adminFunc = false;
angular.module('MaterialApp')
    .controller('documentRecordCtr', ['$scope', '$stateParams','$state', '$rootScope', function ($scope, $stateParams, $state, $rootScope) {
        var statuId = $stateParams.statuId;
        var Status = "*";
        if (statuId == 0) {
            $("#headText").html("进行中的传阅");
            Status = 0;
        } else if (statuId == 1) {
            $("#headText").html("已完成的传阅");
            Status = 1;
        } else if (statuId == 2) {
            Status = 2;
            $("#headText").html("已取消的传阅");
        } else if (statuId == 3) {
            Status = 3;
            $("#headText").html("有异常的传阅");
        } else {
            $("#headText").html("我发起的传阅");
            Status = "*";
        }
        adminFunc = $rootScope.adminFunc;
        grid.set({showPager: true, sizeList: [20, 50, 100, 500, 1000], pageSize: 20});
        grid.setUrl("/suite/plugins/servlet/query/GM_getDocumentRecord");
        grid.load({Status: Status, startIndex: grid.getPageIndex(), patchSize: grid.getPageSize()});
        $scope.doFilter = function () {
            var name = $("#searchBox").val();
            grid.load({subject: name, Status: Status, startIndex: grid.getPageIndex(), patchSize: grid.getPageSize()});
        }

        grid.on("drawcell", function (e) {
            var record = e.record,
                column = e.column,
                field = e.field,
                value = e.value;
            if (field == "subject") {
                if (record.readStatus == "未阅") {
                    e.cellStyle = "text-align:center;font-weight:bolder;color:blue;";
                } else {
                    e.cellStyle = "text-align:center;font-weight:lighter;color:blue;";
                }
                e.cellHtml = '<a href="javascript:void(0)" onclick="openWin(' + record.processId + ')">' + value + '</a>';
            } else if (field == "Status") {
                if (value == 0) {
                    e.cellHtml = "<span class='label label-sm label-info' >进行中</span>";
                } else if (value == 1) {
                    e.cellHtml = "<span class='label label-sm label-success' >已完成</span>";
                } else if (value == 3) {
                    e.cellHtml = "<span class='label label-sm label-dark' >已取消</span>";
                } else if (value == 2) {
                    e.cellHtml = "<span class='label label-sm label-danger' >异常</span>";
                }
            }

        });
    }]);


function onActionRenderer(e) {
    var grid = e.sender;
    var record = e.record;
    //var s = '<a class="btn blue btn-xs"  href="javascript:void(0)" onclick="openWin('+record.threadId+')" >查看<i class="fa fa-search"></i></a>';
    var s = '';
    if (record.giveUser == userName || adminFunc || userName == 'Administrator') {
        s = '<a class="btn red btn-xs"  href="javascript:void(0)" onclick="deleteProcess(' + record.processId + ')" >删除<i class="fa fa-times"></i></a>';
    }
    return s;
}


function onLikerRender1(e) {
    var value = e.value;
    if (value) {
        var len = value.split("!").length;
        return '<a href="#" id="' + value + '" class="showCellTooltip1" data-placement="top">' + len + ' </a>';
    } else {
        return "";
    }
}


var tip1 = new mini.ToolTip();
tip1.set({
    target: document,
    selector: '.showCellTooltip1',
    onbeforeopen: function (e) {
        //alert("nihao")
        e.cancel = false;
    },
    onopen: function (e) {
        var el = e.element;
        var id = el.id;
        //alert(id)
        if (id) {
            this.showLoading();
            var load_data = execute("GM_getReadUserInfo", {readed: id});
            if (load_data) {
                setTimeout(function () {
                    var html = '<table border="1" background-color="#add9c0;"><thead><td>序号</td><td>姓名</td></thead><tbody>';
                    var arr = [];
                    if (load_data.indexOf("; ") > 0) {
                        arr = load_data.split("; ");
                    } else {
                        arr.push(load_data);
                    }
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i]) {
                            html += '<tr align="center"> <td align="center" style="width:40px;">' + i + '</td><td style="width:80px;">' + arr[i] + '</td></tr>';
                        }
                    }
                    html += '</tbody></table>';
                    tip1.setContent(html);
                }, 300);
            }
        }
    }
});


function deleteProcess(processId) {
    mini.confirm("确定删除记录？", "确定？",
        function (action) {
            if (action == "ok") {
                mini.mask({
                    el: document.body,
                    cls: 'mini-mask-loading',
                    html: '正在删除...'
                });
                execute("GM_deleteProcessById", {processId: processId});
                mini.showTips({
                    content: "<b>成功</b> <br/>成功删除！",
                    state: "success",
                    x: "right",
                    y: "center",
                    timeout: 3000
                });
                setTimeout(function () {
                    mini.unmask(document.body);
                    window.parent.location.reload();

                }, 2000);
            } else {
            }
        }
    );
}

function openWin(id) {
    $('.inbox-nav > li.active').removeClass('active');
    window.location.href = "/suite/plugins/web/index.html#/documentRead/documentInfo/" + id;
}
