angular.module('MaterialApp').controller('TaskCtrl', ['$scope','$state','$rootScope','$stateParams',function($scope,$state,$rootScope,$stateParams) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components        
    });
    $scope.filterName="待接收的任务";
    // set sidebar closed and body solid layout mode
    $scope.app.settings.layout.pageContentWhite = true;
    $scope.app.settings.layout.pageBodySolid = true;
    $scope.app.settings.layout.pageSidebarClosed = true;
    $("#taskStatusId").val($stateParams.fold);
    $("#taskReport").height($(window).height()+$(window).height()*0.2-14);
    $scope.qtTaskData=$rootScope.qtTaskData;
    $scope.atTaskData = $rootScope.atTaskData;
    var taskByProcessModelCountsRs = query("GM_Portal_Get_My_Tasks_By_ProcessModel_Count");
    var taskByProcessModelCounts=[{pmId:-1,pmName:"所有单据",count:0}];
    var allCount=0;
    $scope.reloadPage=function(){
        $state.reload();
    }
    for(var i=0;i<taskByProcessModelCountsRs.length;i++){
        if(taskByProcessModelCountsRs[i].pmId!=null){
            taskByProcessModelCounts.push(taskByProcessModelCountsRs[i]);
        }
        allCount=allCount+taskByProcessModelCountsRs[i].count;
    }
    taskByProcessModelCounts[0]["count"]=allCount;
    $scope.taskByProcessModelCounts=taskByProcessModelCounts;
    $scope.setTaskProcessModelId = function(id){
        if(id==-1){
            $rootScope.taskSelectedProcessModelId="";
        }else{
            $rootScope.taskSelectedProcessModelId=id
        }
        $state.reload();
    }
    $scope.processModelActive = function(id){
        if($rootScope.taskSelectedProcessModelId==id||(id==-1&&($rootScope.taskSelectedProcessModelId==null||$rootScope.taskSelectedProcessModelId==""))){
            return "active";
        }else{
            return "";
        }
    }

    $scope.handoverReport = function(id,name){
        //$("html,body").animate({scrollTop:$("#body").offset().top},200);
        var taskReportWinodw = document.getElementById("taskReport").contentWindow;
        $scope.filterName=name;
        if(id==-1){
            $rootScope.taskSelectedProcessModelId="";
            // taskReportWinodw.mini.getbyName("pmodelsFilter").setValue("");
            // taskReportWinodw.mini.getbyName("pmodelsFilter").doValueChanged()
        }else if(id=='atStatus'){
            $rootScope.taskSelectedProcessModelId=-1;
            taskReportWinodw.mini.getbyName("taskstatusFilter").setValue("-1");
            //taskReportWinodw.mini.getbyName("priorityFilter").setValue("");
            //taskReportWinodw.mini.getbyName("pmodelsFilter").setValue(name);
            //taskReportWinodw.mini.getbyName("pmodelsFilter").doValueChanged()
        }else if(id=="atStatusCompleted"){
            $rootScope.taskSelectedProcessModelId=-1;
            taskReportWinodw.mini.getbyName("taskstatusFilter").setValue("2");
            //taskReportWinodw.mini.getbyName("priorityFilter").setValue("");
            // taskReportWinodw.mini.getbyName("pmodelsFilter").setValue(name);
            // taskReportWinodw.mini.getbyName("pmodelsFilter").doValueChanged()
        }else{
            $rootScope.taskSelectedProcessModelId=id
            //taskReportWinodw.mini.getbyName("pmodelsFilter").setValue(name);
            // taskReportWinodw.mini.getbyName("pmodelsFilter").doValueChanged();
        }

    }

    $scope.filterPriority = function(name){
        $scope.filterName=name;
        $rootScope.taskSelectedProcessModelId="-1";
        //var taskReportWinodw = document.getElementById("taskReport").contentWindow;
        // taskReportWinodw.mini.getbyName("pmodelsFilter").setValue("");
        var taskReportWinodw = document.getElementById("taskReport").contentWindow;
        taskReportWinodw.mini.getbyName("taskstatusFilter").setValue("");
        //taskReportWinodw.mini.getbyName("priorityFilter").setValue(2);
        //taskReportWinodw.mini.getbyName("priorityFilter").doValueChanged()
    }
    $scope.filterTaskstatus = function(id,name){
        $scope.filterName=name;
        $rootScope.taskSelectedProcessModelId="-1";
        //var taskReportWinodw = document.getElementById("taskReport").contentWindow;
        //taskReportWinodw.mini.getbyName("pmodelsFilter").setValue("");
        var taskReportWinodw = document.getElementById("taskReport").contentWindow;
        //taskReportWinodw.mini.getbyName("priorityFilter").setValue("");
        if(id=="-1"){
            taskReportWinodw.mini.getbyName("taskstatusFilter").setValue("");
        }else{
            taskReportWinodw.mini.getbyName("taskstatusFilter").setValue(id);
        }
        taskReportWinodw.mini.getbyName("taskstatusFilter").doValueChanged()
    }
}]);




function taskCheck(thiss){
    if($(thiss).attr("checked")==null){
        $(thiss).attr("checked",true);
        $(thiss).next("i").append("<i class='newCheckedI' style='top: 4px;left: 4px;width: 10px;height: 10px;background-color: #23B7E5;position: absolute;'></i>");
    }else{
        $(thiss).attr("checked",false);
        $(thiss).next("i").css("border-color","");
        $(thiss).next("i").css("background-color","");
        $(thiss).next("i").find(".newCheckedI").remove();
    }
}


function acceptTask(id){
    var flag=false;
    $.ajax({
        url: "/suite/plugins/servlet/execute/accepttask",
        type:"get",
        async:false,
        data:{"id":id},
        success: function (text) {
            flag=text;
        },
        error: function () {
            flag = false;
        }
    });
    return flag;
}

function reassignTask(id,userOrGroup){
    var flag=false;
    $.ajax({
        url: "/suite/plugins/servlet/execute/reassigntask",
        type:"get",
        data:{id:id,userOrGroup:userOrGroup},
        async:false,
        success: function (text) {
            flag=text;
        },
        error: function () {
            flag= false;
        }
    });
    return flag;
}

function setTaskPriority(id,priority){
    var flag=false
    $.ajax({
        url: "/suite/plugins/servlet/execute/settaskpriority",
        type:"get",
        data:{id:id,priority:priority},
        async:false,
        success: function (text) {
            flag=text;
        },
        error: function () {
            flag= false;
        }
    });
    return flag;
}


function buttonClick() {
    var taskId = $("#taskId").val();
    if(!taskId){
        alert("请选择至少一条记录");
        return;
    }
    mini.open({
        url: "/suite/plugins/servlet/loadsource/3691/selectUsers.html",
        width: 650,
        height: 380,
        ondestroy: function (action) {

            if (action == "ok") {
                var iframe = this.getIFrameEl();

                var data = iframe.contentWindow.GetData();
                data = mini.clone(data);
                if(data.id){
                    mini.confirm("你确定要转办改任务吗？","任务转办",function(act){

                        if (act == "ok") {
                            var users=data.id.replaceAll("!",";");
                            var fla=reassignTask(taskId,users);
                            if(fla){
                                alert("任务成功转让！");
                            }else{
                                alert("任务转让失败！");
                            }
                        }
                    });

                }else{
                    alert("请选择至少一个人员");
                }

            }
        }
    });

}



function buttonPriory(id) {
    var taskId = $("#taskId").val();
    if(!taskId){
        alert("请选择至少一条记录");
        return;
    }
    mini.confirm("你确定要修改该任务的优先级吗？","优先级",function(act){

        if (act == "ok") {
            var fla=setTaskPriority(taskId,id);
            if(fla){
                alert("转换成功！");
            }else{
                alert("转换失败！");
            }
        }
    });
}


function completeTasks(id,data){
    data["activityId"]=id;
    data["isSubmit"]=true;
    var flag = false;
    $.ajax({
        url: "/suite/plugins/servlet/SetTaskActiveVariable",
        type:"get",
        data:data,
        async:false,
        success: function (text) {
            if(text=="0"){
                flag= false;
            }else if(text=="1"){
                flag= true;

            }else{
                flag= true;
            }
        },
        error: function () {
            flag= false;
        }
    });

}

function setProcessSecurityRole(id,userOrGroup){
    var flag=false;
    $.ajax({
        url: "/suite/plugins/servlet/execute/setprocesssecurityrole",
        type:"get",
        data:{id:id,userOrGroup:userOrGroup},
        async:false,
        success: function (text) {
            if(text==1){
                flag= true;
            }else{
                flag= false;
            }
        },
        error: function () {
            flag= false;
        }
    });
    return flag;
}