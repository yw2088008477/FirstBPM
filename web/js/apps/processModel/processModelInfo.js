angular.module('MaterialApp')
    .controller('processModelInfoController', ['$scope', '$stateParams', function ($scope, $stateParams) {
        var processModelId = $stateParams.processModelId;
        var pm = query("GM_getprocessModelDetails", {processModelId: processModelId})[0];
        //alert(processModelId);
        var wizardData = query("GM_getprocessmodelwizarddata", {processModelId: processModelId})[0];
        var wizard = wizardData.wizard;
        var nodeList = wizardData.nodeList;
        var arr = [{
            "id": 0,
            "guiId": 0,
            "status": 1,
            "laneName": "开始",
            "schemaId": 9,
            "taskInfo": [{
                "assignedtime": "writeStart",
                "assigneesName": "no",
                "statusName": "writeStart",
                "name": "开始"
            }],
            "type": "task",
            "y": 280,
            "x": 728
        }, {
            "id": 0,
            "guiId": 1,
            "status": 1,
            "laneName": "结束",
            "schemaId": 20,
            "type": "task",
            "y": 280,
            "x": 448,
            "taskInfo": [{
                "assignedtime": "writeStart",
                "assigneesName": "no",
                "statusName": "writeStart",
                "name": "结束"
            }]
        }];
        nodeList = nodeList.concat(arr);
        //alert(mini.encode(nodeList));
        console.log(nodeList);
        $scope.nodeList = nodeList;
        //alert(wizard);
        $scope.src = "/suite/plugins/servlet/ProcessModelchartViwe?processMdoelId=" + processModelId;
        var lis = "";
        var divs = ""
        for (var i = 0; i < wizard.length; i++) {
            if (i == 0) {
                lis += "<li><span>开始</span></li>"
            } else if (i + 1 == wizard.length) {
                lis += "<li><span>结束</span></li>"
            } else {
                lis += "<li>" + wizard[i].name + "</li>"
            }
            divs += "<div>"
            if (i == 0 && wizard[i].lanesNodelist == null) {
                divs += "<div style='height:60px;' ><a href='#/app/userprofile/" + wizard[i].creator + "' ><img style='width:50px;white-space:nowrap;border-radius:500px;' ng-src='/suite/plugins/servlet/loadsource/3/" + wizard[i].creator + ".png'>&nbsp;<b>" + wizard[i].creatorName + "&nbsp;</b></a>" + wizard[i].creatorTime + " <span  translate='processModel.publishTheProcessModel'></span></div>"
            } else if (i + 1 == wizard.length && wizard[i].lanesNodelist == null) {
                divs += "<span>该单据还没有发起</span>"
            } else if (wizard[i].lanesNodelist != null && wizard[i].lanesNodelist.length > 0) {
                var allInstanceCount = 0;
                divs += "<div class='panel panel-info'><div class='panel-heading'><b style='margin-top:3px;' class='label bg-info pull-left'>" + (i + 1) + "</b>&nbsp;&nbsp;" + wizard[i].name + "-<span>相关节点</span></div>"
                divs += "<table  class='table table-striped m-b-none'><thead><tr><th><span>类型</span></th><th><span>处理人</span></th><th><span>名称</span></th><th><span>状态</span></th><th><span>分配时间</span></th><th><span>完成时间</span></th></tr></thead><tbody>"
                var lanesNodelist = wizard[i].lanesNodelist;
                for (var j = 0; j < lanesNodelist.length; j++) {
                    allInstanceCount = allInstanceCount + lanesNodelist[j].instanceCount;
                    if (lanesNodelist[j].type == "task") {
                        var taskInfos = lanesNodelist[j].taskInfo;
                        for (var k = 0; k < taskInfos.length; k++) {
                            var taskInfo = taskInfos[k];
                            divs += "<tr>"
                            divs += "<td style='vertical-align:middle' width='80' ><span>任务</span></td>"
                            if (taskInfo.taskId == null) {
                                divs += "<td style='vertical-align:middle' width='140' ><span>暂无</span></td>"
                            } else {
                                divs += "<td style='vertical-align:middle' width='140' ><a href='#/app/userprofile/" + taskInfo.assignees + "' class='avatar thumb pull-left m-r'><img ng-src='/suite/plugins/servlet/loadsource/3/" + taskInfo.assignees + ".png'><b>&nbsp;" + taskInfo.assigneesName + "</b></a></td>"
                            }
                            if (taskInfo.taskId == null) {
                                divs += "<td style='vertical-align:middle' ><b>" + taskInfo.name + "</b></td>";
                            } else {
                                divs += "<td style='vertical-align:middle' ><a ui-sref='app.taskdetail({taskId:" + taskInfo.taskId + "})' ><b>" + taskInfo.name + "</b></a></td>"
                            }
                            divs += "<td style='vertical-align:middle' ><span>暂未开始</td>"
                            divs += "<td style='vertical-align:middle' ><span>暂未开始</td>"
                            if (taskInfo.completedTime == null) {
                                divs += "<td style='vertical-align:middle' ></td>"
                            } else {
                                divs += "<td style='vertical-align:middle' >" + taskInfo.completedTime + "</td>"
                            }
                            divs += "</tr>"
                        }
                    } else if (lanesNodelist[j].type == "process") {
                        var processInfos = lanesNodelist[j].processInfo;
                        for (var k = 0; k < processInfos.length; k++) {
                            var processInfo = processInfos[k];
                            divs += "<tr>"
                            divs += "<td style='vertical-align:middle' width='80' ><span>流程</span></td>"
                            if (processInfo.processId == null) {
                                divs += "<td style='vertical-align:middle' width='140' ><span>暂无</td>"
                            } else {
                                divs += "<td style='vertical-align:middle' width='140' ><a href='#/app/userprofile/" + processInfo.initiator + "' class='avatar thumb pull-left m-r'><img ng-src='/suite/plugins/servlet/loadsource/3/" + processInfo.initiator + ".png'><b>&nbsp;" + processInfo.initiatorName + "</b></a></td>"
                            }
                            if (processInfo.processId == null) {
                                divs += "<td style='vertical-align:middle' ><b>" + processInfo.name + "</b></td>";
                            } else {
                                divs += "<td style='vertical-align:middle' ><a ui-sref='app.processdetail({processId:" + processInfo.processId + "})' ><b>" + processInfo.name + "</b></a></td>"
                            }
                            divs += "<td style='vertical-align:middle' ><span>暂未开始</td>"
                            divs += "<td style='vertical-align:middle' ><span>暂未开始</td>"
                            if (processInfo.endTime == null) {
                                divs += "<td style='vertical-align:middle' ></td>"
                            } else {
                                divs += "<td style='vertical-align:middle' >" + processInfo.endTime + "</td>"
                            }
                            divs += "</tr>"
                        }

                    }

                }
                divs += "</tbody></table></div>"
            } else {
                divs += "<span>暂无相关信息</span>"
            }
            divs += "</div>"
        }

        $("#wizard ol").append(lis);
        $("#wizard").append(divs);

        $("#wizard").bwizard();
        $("#wizard").bwizard("show", wizardData.selectIndex)
        $(".bwizard-buttons").hide();
        //$scope.wizard=wizard;
        $scope.pm = pm;


    }]);