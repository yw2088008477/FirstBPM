angular.module('MaterialApp')
    .controller('processListCtrl', ['$scope', '$stateParams', '$state', '$uibModal', '$rootScope', function ($scope, $stateParams, $state, $uibModal, $rootScope) {

        $scope.filteredTodos = []
            , $scope.currentPage = 1
            , $scope.numPerPage = 10
            , $scope.maxSize = 10;
        var tree = mini.get("processModelTree");
        if ($rootScope.selectedProcessModeFolderId != null && $rootScope.selectedProcessModeFolderId != "") {
            tree.loadNode(tree.getNode($rootScope.selectedProcessModeFolderId));
        }
        tree.on("load", function () {
            if ($rootScope.selectedProcessModelId != null && $rootScope.selectedProcessModelId != "") {
                tree.selectNode(tree.getNode("" + $rootScope.selectedProcessModelId));
            }
        })
        if ($scope.searchProcess != null) {
            $rootScope.searchProcess = $scope.searchProcess;
        } else {
            $scope.searchProcess = $rootScope.searchProcess;
        }
        var rsProcess;
        var totalCount = 0;
        if ($("#searchProcess").val() != "") {
            $scope.searchProcess = $("#searchProcess").val();
        }
        $scope.$watch("currentPage + numPerPage", function () {
            var type = "status"
            if ($stateParams.fold == "" || $stateParams.fold == "-1" || $stateParams.fold == "0" || $stateParams.fold == "1" || $stateParams.fold == "2" || $stateParams.fold == "3" || $stateParams.fold == "4") {
                type = "status"
            } else {
                type = $stateParams.fold;
            }
            rsProcess = query("GM_Portal_Query_Process", {
                "type": type,
                "status": $stateParams.fold,
                "indexnum": $scope.currentPage * $scope.numPerPage - ($scope.maxSize - 1),
                "pagenum": $scope.maxSize,
                "searchProcess": $scope.searchProcess,
                pmId: $rootScope.selectedProcessModelId
            })[0];
            if (rsProcess.totalCount == 0) {
                $("#noProcess").show();
            } else {
                $("#noProcess").hide();
            }
            totalCount = (rsProcess.totalCount / 10) * 10;
            if ($stateParams.fold == -1) {
                $("#navsProcessAllCount").html(totalCount);
                if ($stateParams.fold != 1) {
                    if (totalCount == 0) {
                        $("#navsProcessAllCount").hide();
                    } else {
                        $("#navsProcessAllCount").show();
                    }
                }
            }
            $scope.makeTodos();
            var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
            $scope.filteredTodos = $scope.todos.slice(begin, end);
            $scope.processs = rsProcess.process;
        });
        $scope.searchProcessed = function () {
            $rootScope.searchProcess = $scope.searchProcess;
            $("#searchProcess").val($scope.searchProcess);
            var type = "status"
            if ($stateParams.fold == "" || $stateParams.fold == "-1" || $stateParams.fold == "0" || $stateParams.fold == "1" || $stateParams.fold == "2" || $stateParams.fold == "3" || $stateParams.fold == "4") {
                type = "status"
            } else {
                type = $stateParams.fold;
            }
            rsProcess = query("GM_Portal_Query_Process", {
                "type": type,
                "status": $stateParams.fold,
                "indexnum": $scope.currentPage * $scope.numPerPage - ($scope.maxSize - 1),
                "pagenum": $scope.maxSize,
                "searchProcess": $scope.searchProcess,
                pmId: $rootScope.selectedProcessModelId
            })[0];
            if (rsProcess.totalCount == 0) {
                $("#noProcess").show();
            } else {
                $("#noProcess").hide();
            }
            totalCount = (rsProcess.totalCount / 10) * 10;
            $scope.makeTodos();
            var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
            $scope.filteredTodos = $scope.todos.slice(begin, end);
            $scope.processs = rsProcess.process;
        }


        mini.get("processModelTree").on("nodeclick", function () {
            var selectedProcessModel = mini.get("processModelTree").getSelectedNode();
            if (selectedProcessModel.isLeaf) {
                $rootScope.selectedProcessModelId = selectedProcessModel.id;
                $state.reload();
            } else {
                $rootScope.selectedProcessModeFolderId = selectedProcessModel.id;
            }
        })

        mini.get("processModelTree").on("collapse", function () {
            if ($rootScope.selectedProcessModelId != null && $rootScope.selectedProcessModelId != "") {
                $rootScope.selectedProcessModeFolderId = "";
                $rootScope.selectedProcessModelId = "";
                $state.reload();
            }
        })

        $scope.makeTodos = function () {
            $scope.todos = [];
            for (i = 1; i <= totalCount; i++) {
                $scope.todos.push({text: "todo " + i, done: false});
            }
        };

        $scope.labelClass = function (label) {
            return {
                'b-l-info': angular.lowercase(label) === 0,
                'b-l-warning': angular.lowercase(label) === 2,
                'b-l-dark': angular.lowercase(label) === 3,
                'b-l-danger': angular.lowercase(label) === 4,
                'b-l-success': angular.lowercase(label) === 1
            };
        };
        $scope.bgClass = function (label) {
            return {
                'bg-info': angular.lowercase(label) === 0,
                'bg-warning': angular.lowercase(label) === 2,
                'bg-dark': angular.lowercase(label) === 3,
                'bg-danger': angular.lowercase(label) === 4,
                'bg-success': angular.lowercase(label) === 1
            };
        };

        $scope.processAllCheck = function () {
            if ($(".processAllCheck").attr("checked") == null) {
                $(".processAllCheck").attr("checked", true);
                $(".processCheck").attr("checked", true);
                $(".processCheck").next("i").css("border-color", "#23B7E5");
                $(".processCheck").next("i").append("<i class='newCheckedI' style='top: 4px;left: 4px;width: 10px;height: 10px;background-color: #23B7E5;position: absolute;'></i>");

            } else {
                $(".processAllCheck").attr("checked", false);
                $(".processCheck").attr("checked", false);
                $(".processCheck").next("i").css("border-color", "");
                $(".processCheck").next("i").css("background-color", "");
                $(".processCheck").next("i").find(".newCheckedI").remove();
            }
        }

        $scope.resumeProcess = function (url, size) {
            var processIds = $(".processCheck:checked");
            if (processIds.length > 0) {
                for (var i = 0; i < processIds.length; i++) {
                    resumeProcess(processIds.eq(i).val())
                }
                setTimeout(function () {
                    $state.reload();
                }, 500);

            } else {
                alert("请选择至少一条记录");
            }
        };

        $scope.pauseProcess = function (url, size) {
            var processIds = $(".processCheck:checked");
            if (processIds.length > 0) {
                for (var i = 0; i < processIds.length; i++) {
                    pauseProcess(processIds.eq(i).val())
                }
                setTimeout(function () {
                    $state.reload();
                }, 500);

            } else {
                alert("请选择至少一条记录");
            }
        };

        $scope.cancelProcess = function (url, size) {
            var processIds = $(".processCheck:checked");
            if (processIds.length > 0) {
                for (var i = 0; i < processIds.length; i++) {
                    cancelProcess(processIds.eq(i).val())
                }
                setTimeout(function () {
                    $state.reload();
                }, 800);

            } else {
                alert("请选择至少一条记录");
            }
        };

        $scope.open = function (url, size) {
            var modalInstance = $uibModal.open({
                templateUrl: url,
                controller: 'ProcessModalInstanceCtrl',
                size: size
            });

        };
        $scope.setProcessSecurityRole = function (url, size) {
            var processIds = $(".processCheck:checked");
            if (processIds.length > 0) {
                $scope.open(url, size);
            } else {
                alert("请选择至少一条记录");
            }
        };


    }]);
MetronicApp.controller('ProcessCtrl', ['$scope','$state','$rootScope','$stateParams',function($scope,$state,$rootScope,$stateParams) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = true;
    $scope.qtProcessData=$rootScope.qtProcessData;

    if($stateParams.fold==-1){
        $("#processStatusId").val("");
    }else{
        $("#processStatusId").val($stateParams.fold);
    }
    $scope.reloadPage=function(){
        $state.reload();
    }
    $("#processReport").height($(window).height());
    var processByProcessModelCountsRs = query("GM_Portal_Get_My_Process_By_ProcessModel_Count");
    var processByProcessModelCounts=[{pmId:-1,pmName:"所有单据",count:0}];
    var allCount=0;
    for(var i=0;i<processByProcessModelCountsRs.length;i++){
        if(processByProcessModelCountsRs[i].pmId!=null){
            //alert(mini.encode(processByProcessModelCountsRs));
            if(processByProcessModelCountsRs[i].description.indexOf("{")==0){
                processByProcessModelCountsRs[i]["reportId"] = eval("["+processByProcessModelCountsRs[i].description+"]")[0].reportId
            }
            processByProcessModelCounts.push(processByProcessModelCountsRs[i]);
        }
        allCount=allCount+processByProcessModelCountsRs[i].count;
    }
    processByProcessModelCounts[0]["count"]=allCount;
    $scope.processByProcessModelCounts=processByProcessModelCounts;
    $scope.setProcessProcessModelId = function(id){
        if(id==-1){
            $rootScope.selectedProcessModelId="";
        }else{
            $rootScope.selectedProcessModelId=id
        }
        $state.reload();
    }
    $scope.processModelActive = function(id){
        if($rootScope.selectedProcessModelId==id||(id==-1&&($rootScope.selectedProcessModelId==null||$rootScope.selectedProcessModelId==""))){
            return "active";
        }else{
            return "";
        }
    }

    $scope.handoverReport = function(id,reportId,name,e){
        $('.inbox-header > h1').text(name);
        //$("html,body").animate({scrollTop:$("#body").offset().top},200);
        if(id==-1){
            $rootScope.selectedProcessModelId="";
            $("#processModelName").val("");
            $("#processReport").attr("src","/suite/plugins/servlet/ViewReportTasksAndProcess?reportId=980");
        }else if(reportId==""||reportId=="{{processByProcessModelCount.reportId}}"){
            $("#processModelName").val(name);
            $("#processStatusId").val("");
            $rootScope.selectedProcessModelId=id;
            $("#processReport").attr("src","/suite/plugins/servlet/ViewReportTasksAndProcess?reportId=980");
        }else{
            $rootScope.selectedProcessModelId=id
            //alert(reportId);
            if(reportId!=null&&reportId!=""){
                $("#processReport").attr("src","/suite/plugins/servlet/ViewReportTasksAndProcess?reportId="+reportId)

            }
        }

    }


    $scope.filterPriority = function(e,obj){
        $('.inbox-nav > li.active').removeClass('active');
        $(e.target).closest('li').addClass('active');
        $('.inbox-header > h1').text(obj);
        var processReportWinodw = document.getElementById("processReport").contentWindow;
        processReportWinodw.mini.getbyName("processstatusFilter").setValue("");
        processReportWinodw.mini.getbyName("processstatusFilter").doValueChanged()
        if(processReportWinodw.mini.getbyName("priorityFilter")!=null){
            processReportWinodw.mini.getbyName("priorityFilter").setValue(2);
            processReportWinodw.mini.getbyName("priorityFilter").doValueChanged()
        }
    }
    $scope.filterProcessstatus = function(id,e,obj){
        $("#processStatusId").val(id);
        $('.inbox-nav > li.active').removeClass('active');
        $(e.target).closest('li').addClass('active');
        $('.inbox-header > h1').text(obj);
        var processReportWinodw = document.getElementById("processReport").contentWindow;
        if(processReportWinodw.mini.getbyName("priorityFilter")!=null){
            processReportWinodw.mini.getbyName("priorityFilter").setValue("");
        }
        if(id==-1){
            $rootScope.selectedProcessModelId="-1";
            $("#processModelName").val("");
            $("#processStatusId").val("");
            //$("#processReport").attr("src","/suite/plugins/servlet/ViewReportTasksAndProcess?reportId=980");
            processReportWinodw.mini.getbyName("processstatusFilter").setValue("");
            processReportWinodw.mini.getbyName("processstatusFilter").doValueChanged()
        }else{
            processReportWinodw.mini.getbyName("processstatusFilter").setValue(id);
            processReportWinodw.mini.getbyName("processstatusFilter").doValueChanged()
        }
    }


}]);

