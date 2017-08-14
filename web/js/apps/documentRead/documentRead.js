angular.module('MaterialApp')
    .controller('documentReadCtrl', ['$scope', '$state', '$rootScope', '$stateParams', function ($scope, $state, $rootScope, $stateParams) {
        // set sidebar closed and body solid layout mode
        $scope.app.settings.layout.pageContentWhite = true;
        $scope.app.settings.layout.pageBodySolid = true;
        $scope.app.settings.layout.pageSidebarClosed = true;
        $scope.cyProcessData = $rootScope.cyProcessData;
        $scope.cyTaskData = $rootScope.cyTaskData;


        $scope.loadPageBy = function () {
            //$("#inboxHeader").hide();
            //$('.inbox-header > h1').text("新建传阅");
            $('.inbox-nav > li.active').removeClass('active');
            $state.go('documentRead.documentComposeStart', {processModelId: 2174});
        }

        $scope.loadPageFr = function (id, e, obj) {
            //$("#inboxHeader").hide();
            $('.inbox-nav > li.active').removeClass('active');
            $(e.target).closest('li').addClass('active');
            //$('.inbox-header > h1').text(obj);
            $state.go('documentRead.documentInbox', {reportId: id});
        }

        $scope.loadPageFt = function (id, e, obj) {
            //$("#inboxHeader").hide();
            $('.inbox-nav > li.active').removeClass('active');
            $(e.target).closest('li').addClass('active');
            //$('.inbox-header > h1').text(obj);
            $state.go('documentRead.documentRecord', {statuId: id});
        }
        if ($stateParams.fold == -1) {
            $("#processStatusId").val("");
        } else {
            $("#processStatusId").val($stateParams.fold);
        }
        $scope.reloadPage = function () {
            $state.reload();
        }

        $scope.setProcessProcessModelId = function (id) {
            if (id == -1) {
                $rootScope.selectedProcessModelId = "";
            } else {
                $rootScope.selectedProcessModelId = id
            }
            $state.reload();
        }
        $scope.processModelActive = function (id) {
            if ($rootScope.selectedProcessModelId == id || (id == -1 && ($rootScope.selectedProcessModelId == null || $rootScope.selectedProcessModelId == ""))) {
                return "active";
            } else {
                return "";
            }
        }

        $scope.handoverReport = function (id, reportId, name, e) {
            $('.inbox-header > h1').text(name);
            //$("html,body").animate({scrollTop:$("#body").offset().top},200);
            if (id == -1) {
                $rootScope.selectedProcessModelId = "";
                $("#processModelName").val("");
                $("#processReport").attr("src", "/suite/plugins/servlet/ViewReportTasksAndProcess?reportId=3597");
            } else if (reportId == "" || reportId == "{{processByProcessModelCount.reportId}}") {
                $("#processModelName").val(name);
                $("#processStatusId").val("");
                $rootScope.selectedProcessModelId = id;
                $("#processReport").attr("src", "/suite/plugins/servlet/ViewReportTasksAndProcess?reportId=3597");
            } else {
                $rootScope.selectedProcessModelId = id
                //alert(reportId);
                if (reportId != null && reportId != "") {
                    $("#processReport").attr("src", "/suite/plugins/servlet/ViewReportTasksAndProcess?reportId=" + reportId)

                }
            }

        }


        $scope.filterPriority = function (e, obj) {
            $('.inbox-nav > li.active').removeClass('active');
            $(e.target).closest('li').addClass('active');
            $('.inbox-header > h1').text(obj);
            var processReportWinodw = document.getElementById("processReport").contentWindow;
            processReportWinodw.mini.getbyName("processstatusFilter").setValue("");
            processReportWinodw.mini.getbyName("processstatusFilter").doValueChanged()
            if (processReportWinodw.mini.getbyName("priorityFilter") != null) {
                processReportWinodw.mini.getbyName("priorityFilter").setValue(2);
                processReportWinodw.mini.getbyName("priorityFilter").doValueChanged()
            }
        }
        $scope.filterProcessstatus = function (id, e, obj) {
            $("#processStatusId").val(id);
            $('.inbox-nav > li.active').removeClass('active');
            $(e.target).closest('li').addClass('active');
            $('.inbox-header > h1').text(obj);
            var processReportWinodw = document.getElementById("processReport").contentWindow;
            if (processReportWinodw.mini.getbyName("priorityFilter") != null) {
                processReportWinodw.mini.getbyName("priorityFilter").setValue("");
            }
            if (id == -1) {
                $rootScope.selectedProcessModelId = "-1";
                $("#processModelName").val("");
                $("#processStatusId").val("");
                //$("#processReport").attr("src","/suite/plugins/servlet/ViewReportTasksAndProcess?reportId=980");
                processReportWinodw.mini.getbyName("processstatusFilter").setValue("");
                processReportWinodw.mini.getbyName("processstatusFilter").doValueChanged()
            } else {
                processReportWinodw.mini.getbyName("processstatusFilter").setValue(id);
                processReportWinodw.mini.getbyName("processstatusFilter").doValueChanged()
            }
        }


    }]);

angular.module('MaterialApp')
    .controller('documentCtr', ['$scope', '$stateParams',function ($scope, $stateParams) {
        var reportId = $stateParams.reportId;
        var readStatus = "*";
        if (reportId == "1") {
            $("#headText").html("我的待阅");
            readStatus = "未阅";
        } else if (reportId == "2") {
            $("#headText").html("我的待阅");
            readStatus = "已阅";
        } else {
            readStatus = "*";
            $("#headText").html("所有传阅");
        }
        mini.parse();
        var grid = mini.get("datagrid1");
        grid.set({showPager: true, sizeList: [20, 50, 100, 500, 1000], pageSize: 20});
        grid.setUrl("/suite/plugins/servlet/query/GM_getDocumentRead");
        grid.load({readStatus: readStatus, startIndex: grid.getPageIndex(), patchSize: grid.getPageSize()});
        $scope.doFilter = function () {
            var name = $("#searchBox").val();
            grid.load({
                readStatus: readStatus,
                subject: name,
                startIndex: grid.getPageIndex(),
                patchSize: grid.getPageSize()
            });
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
                e.cellHtml = '<a href="javascript:void(0)" onclick="openWin(' + record.taskId + ')">' + value + '</a>';
            } else if (field == "taskStatus") {
                if (value == 0) {
                    e.cellHtml = "<span class='label label-sm label-warning' >待接收</span>";
                } else if (value == 1) {
                    e.cellHtml = "<span class='label label-sm label-info' >进行中</span>";
                } else if (value == 2) {
                    e.cellHtml = "<span class='label label-sm label-success' >已完成</span>";
                }
            }

        });
    }]);
function openWin(id) {
    $('.inbox-nav > li.active').removeClass('active');
    window.location.href = "/suite/plugins/web/index.html#/documentRead/documentView/" + id;
}
