var pm = [];
var wizardData = [];
var user = [];
var processNotes = [];
var processId = "";
var author = "";
var authorName = "";
var authorTitle = "";
angular.module('MaterialApp').controller('processInfoController', ['$scope', '$stateParams', '$state', '$uibModal', 'processDetailFactory', '$timeout', function ($scope, $stateParams, $state, $uibModal, processDetailFactory, $timeout) {
    processId = $stateParams.processId;
    $scope.showLoading = true;
    $scope.notesLoading = true;
    $scope.reloadPage = function () {

        $state.reload();
    }
    $scope.iframeLoading = true;
    $scope.setUrl = function () {
        $scope.src = "/suite/plugins/servlet/ProcessRunChartViwe?processId=" + processId;
        $timeout(function () {
            $scope.iframeLoading = false;
        }, 3000)
    }

    $scope.processId = processId;

    processDetailFactory.getProcessDetails(processId);
    $scope.$on("processDetailserviceUpdata", function (event, res) {
        $scope.pm = res.data;
        var nin = $scope.pm.initiatorName ? $scope.pm.initiatorName : $scope.pm.initiator;
        var starttt = $scope.pm.starttime;
        var staatu = $scope.pm.statusName;
        $scope.pmNameName = nin + "在" + starttt + "发起了这个流程模型。目前的状态是【" + staatu + "】。";
        $scope.participants = [];
        var participantIds = $scope.pm.participantIds.split(",");
        var participantNames = $scope.pm.participants.split(",");
        for (var i = 0; i < participantIds.length; i++) {
            if (participantIds[i] != "") {
                $scope.participants.push({id: participantIds[i], name: participantNames[i]})
            }
        }

    });
    //alert(processModelId);
    processDetailFactory.getProcessWizardData(processId);
    $scope.$on("wizardserviceUpdata", function (event, data) {
        if (data.data && data.data.length > 0) {
            wizardData = data.data[0];
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
            $scope.nodeList = nodeList;
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
                    if (wizard[i].initiator != user.userName) {
                        divs += "<div style='width:100%;'  ><div style='height:50px;' ><a  href='#/userProfile/" + wizard[i].initiator + "'  ><img style='width:50px;white-space:nowrap;border-radius:500px;' src='/suite/plugins/servlet/loadsource/3/" + wizard[i].initiator + ".png'>&nbsp;<b>" + wizard[i].initiatorName + "</b></a>&nbsp;" + wizard[i].startTime + " <span>发起了该记录</span></div></div>"
                    } else {
                        divs += "<div style='width:100%;'  ><div style='height:50px;' ><a  href='#/profile/dashboard' ><img style='width:50px;white-space:nowrap;border-radius:500px;' src='/suite/plugins/servlet/loadsource/3/" + wizard[i].initiator + ".png'>&nbsp;<b>" + wizard[i].initiatorName + "</b></a>&nbsp;" + wizard[i].startTime + " <span>发起了该记录</span></div></div>"
                    }
                } else if (i + 1 == wizard.length && wizard[i].lanesNodelist == null) {
                    if (wizard[i].endTime == null) {
                        divs += "<span>该记录还在进行中</span>"
                    } else {
                        divs += "<span>该记录</span>&nbsp;" + wizard[i].endTime + "&nbsp;<span>已完成</span>"
                    }
                } else if (wizard[i].lanesNodelist != null && wizard[i].lanesNodelist.length > 0) {
                    var allInstanceCount = 0;
                    divs += "<div class='panel panel-info'><div class='panel-heading'><i class='fa  fa-edit icon text-info-dker'></i>&nbsp;&nbsp;" + wizard[i].name + "-<span>相关节点</span></div>"
                    divs += "<table  class='table table-striped table-hover table-bordered'><thead><tr><th><span>类型</span></th><th><span>处理人</span></th><th><span>名称</span></th><th><span>状态</span></th><th><span>分配时间</span></th><th><span>完成时间</span></th></tr></thead><tbody>"
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
                                    divs += "<td style='vertical-align:middle' width='150' ><span>暂无</span></td>"
                                } else if (taskInfo.assignees != "") {
                                    var assignees = taskInfo.assignees;
                                    if (taskInfo.status >= 1) {
                                        assignees = taskInfo.owner;
                                    }
                                    var assigneesA = "";
                                    if (assignees.length == 1) {
                                        if (assignees[0].type == "user" && assignees[0].id != user.userName) {
                                            assigneesA += "<a href='#/userProfile/" + assignees[0].id + "' class='avatar thumb-sm pull-left m-r'><img src='/suite/plugins/servlet/loadsource/3/" + assignees[0].id + ".png' width='30' height='30' ><b>&nbsp;" + assignees[0].name + "</b></a>"
                                        } else {
                                            assigneesA += "<a href='#/profile/dashboard'><b>" + assignees[0].name + "</b></a>"
                                        }
                                    } else {
                                        for (var a = 0; a < assignees.length; a++) {
                                            if (assignees[a].type == "user" && assignees[0].id != user.userName) {
                                                assigneesA += "&nbsp;&nbsp;&nbsp;<a href='#/userProfile/" + assignees[a].id + "' ><b>" + assignees[a].name + "</b></a>"
                                            } else {
                                                assigneesA += "&nbsp;&nbsp;&nbsp;<a href='#/profile/dashboard'><b>" + assignees[a].name + "</b></a>"
                                            }
                                        }
                                    }
                                    divs += "<td style='vertical-align:middle' width='200' >" + assigneesA + "</td>"
                                } else {

                                    divs += "<td style='vertical-align:middle' width='150' ><b>&nbsp;<span>暂无</span></b></a></td>"
                                }
                                if (taskInfo.taskId == null) {
                                    divs += "<td style='vertical-align:middle' width='250' ><b>" + taskInfo.name + "</b></td>";
                                } else {
                                    divs += "<td style='vertical-align:middle' width='250' >"
                                    divs += "<a href='" + getUrlbyProcess($scope.pm.processModelId, taskInfo.taskId, 'task', '') + "' target='_blank'><b>"
                                    divs += taskInfo.display + "</b></a>&nbsp;&nbsp;&nbsp;<a href='" + getUrlbyProcess($scope.pm.processModelId, taskInfo.taskId, 'print','') + "' target='_blank' ><b>打印</b></a></td>"
                                }
                                divs += "<td style='vertical-align:middle' width='250' ><b>" + taskInfo.name + "</b></td>";
                                divs += "<td style='vertical-align:middle' ><span>" + taskInfo.statusName + "</span></td>"
                                if (taskInfo.status == 12 || taskInfo.assignedtime == "writeStart") {
                                    divs += "<td style='vertical-align:middle' ><span>暂未开始</span></td>"
                                } else {
                                    divs += "<td style='vertical-align:middle' >" + taskInfo.assignedtime + "</td>"
                                }
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
                                    divs += "<td style='vertical-align:middle' width='140' ><span>暂无</span></td>"
                                } else {
                                    divs += "<td style='vertical-align:middle' width='140' ><a href='#/profile/dashboard/" + processInfo.initiator + "'class='avatar thumb-sm pull-left m-r'><img src='/suite/plugins/servlet/loadsource/3/" + processInfo.initiator + ".png' width='30' height='30'><b>&nbsp;" + processInfo.initiatorName + "</b></a></td>"
                                }
                                if (processInfo.processId == null) {
                                    divs += "<td style='vertical-align:middle' ><b>" + processInfo.name + "</b></td>";
                                } else {
                                    divs += "<td style='vertical-align:middle' ><a href='#/processInfo/" + processInfo.processId + "' ><b>" + processInfo.name + "</b></a></td>"
                                }
                                divs += "<td style='vertical-align:middle' ><span>" + processInfo.statusName + "</span></td>"

                                if (processInfo.startTime == null || processInfo.startTime == "writeStart") {
                                    divs += "<td style='vertical-align:middle' ><span>暂未开始</span></td>"
                                } else {
                                    divs += "<td style='vertical-align:middle' >" + processInfo.startTime + "</td>"
                                }
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
            $scope.showLoading = false;
            $("#wizard ol").append(lis);
            $("#wizard").append(divs);
            $("#wizard").bwizard();
            $("#wizard").bwizard("show", wizardData.selectIndex)
            $(".bwizard-buttons").hide();
        }

    })
    //wizardData = query("GM_getprocesswizarddata", {processId: processId})[0];

    processDetailFactory.getloginUserInfo();
    $scope.$on("loginuserInfoUpdata", function (event, data) {
        user = data.data;
        author = user.userName;
        authorName = user.firstName;
        authorTitle = user.customField1;
        $scope.user = user;
        $scope.userSrc = "/suite/plugins/servlet/loadsource/3/" + user.userName + ".png";
        $scope.userHref = "#/profile/dashboard/" + user.userName;
        processDetailFactory.getProcessnotes(processId);
    })
    $scope.$on("notesServiceUpdata", function (event, data) {
        processNotes = data.data;
        $scope.processNotes = processNotes;
        var notes = processNotes;
        var notesDivs;
        if (notes.length == 0) {
            $("#notes").append("<div id='notesDiscussion' style='width:100%;height:50px;padding-left:45%;padding-top:10px;' ><span>当前还没有评论消息哦。</span></div>")
        } else {
            var noteDivs = '<div class="panel panel-default"><div class="panel-heading">评论</div><table class="table table-striped table-hover table-bordered"><thead><tr><th>评论人</th><th>职位</th><th>内容</th><th>评论时间</th><th>附件</th></tr></thead><tbody id="notesTbody">'
            for (var i = 0; i < notes.length; i++) {
                if (notes[i].content != null) {
                    var content = notes[i].content.content
                    var attachsDiv = "";
                    var mes = notes[i].content.attachs;
                    if (mes != null) {
                        attachsDiv += "<div style='margin-top:5px;'  >";
                        for (var j = 0; j < mes.length; j++) {
                            var img = "";
                            if (mes[j].suffix == "jpg" || mes[j].suffix == "png" || mes[j].suffix == "gif") {
                                img = "<img src='/suite/doc/" + mes[j].id + "' style='height:80px;' >";
                            } else {
                                img = "<img src='/suite/plugins/img/attach/attach.png'  style='height:80px;' >";
                            }
                            attachsDiv += "<div id='attach" + mes[j].id + "'  class='panel b-a inline m-r-sm m-b-sm bg-light' >  <div class='wrapper-xs b-b'><i class='fa fa-paperclip'></i> " + mes[j].name + "</div> <div class='wrapper-xs lt' style='height:100px;width:100%;text-align: center;' > 				<a href='/suite/doc/" + mes[j].id + "' >" + img + "</a> 			  </div> 			</div>";
                        }
                        attachsDiv += "</div>"
                    }
                    //var noteDiv = "<div>           <a href='#/app/userprofile/"+notes[i].author+"' class='pull-left thumb-sm avatar m-l-n-md'>             <img src='/suite/plugins/servlet/loadsource/3/"+notes[i].author+".png' class='img-circle' alt='...'>           </a>           <div class='m-l-lg panel b-a'>             <div class='panel-heading pos-rlt b-b b-light'>               <span class='arrow left'></span>               <a href>"+notes[i].authorName+"</a>               <label class='label bg-info m-l-xs'>"+notes[i].groupName+"</label>               <span class='text-muted m-l-sm pull-right'>                 <i class='fa fa-clock-o'></i>                 "+notes[i].createTimestamp+"               </span>             </div>             <div class='panel-body'>               <div>"+content+attachsDiv+"</div>             </div>           </div>         </div>";
                    noteDivs += "<tr><td><img src='/suite/plugins/servlet/loadsource/3/" + notes[i].author + ".png' style='border-radius:2px;' width='30' height='30' >&nbsp;"
                    if (notes[i].author != user.userName) {
                        noteDivs += "<a href='#/userProfile/" + notes[i].author + "'";
                    } else {
                        noteDivs += "<a href='#/profile/dashboard'";
                    }
                    noteDivs += " style='text-decoration:none;color: #428BCA;' >" + notes[i].authorName + "</a></td><td>" + notes[i].groupName + "</td><td style='text-align:left;'>" + content + "</td><td>" + notes[i].createTimestamp + "</td><td>" + attachsDiv + "</td></tr>"

                }
            }
            $("#notes").append(noteDivs + "</tbody></table></div>");
        }
        $scope.notesLoading = false;
    })


    //$(".well").hide();


    var attachs = [];


    processid = processId;
    var myDate = new Date();
    var createTimestamp = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();

    $scope.sendProcessNote = function () {
        var content = $("#content").val();
        if (content != null && content != "") {
            var data;
            if (attachs.length == 0) {
                data = {id: processid, content: content};
            } else {
                data = {id: processid, content: content, attachs: attachs};
            }
            var at = $("#at").val();
            if (at != null && at != "") {
                if (attachs.length == 0) {
                    data["attachs"] = "";
                }
                data["taskId"] = 0;
                data["at"] = at;
            }
            var rs = execute("createprocessnote", data);
            if (rs) {
                var attachsDiv = "<div style='margin-top:5px;'  >";
                var mes = attachs;
                for (var i = 0; i < mes.length; i++) {
                    var img = "";
                    if (mes[i].suffix == "jpg" || mes[i].suffix == "png" || mes[i].suffix == "gif") {
                        img = "<img src='/suite/doc/" + mes[i].id + "' style='height:80px;' >";
                    } else {
                        img = "<img src='/suite/plugins/img/attach/attach.png'  style='height:80px;' >";
                    }
                    attachsDiv += "<div id='attach" + mes[i].id + "'  class='panel b-a inline m-r-sm m-b-sm bg-light' >  <div class='wrapper-xs b-b'><i class='fa fa-paperclip'></i> " + mes[i].name + "</div> <div class='wrapper-xs lt' style='height:100px;width:100%;text-align: center;' > 				<a href='/suite/doc/" + mes[i].id + "' >" + img + "</a> 			  </div> 			</div>";
                }
                attachsDiv += "</div>"
                //var note = "<div>           <a href='#/app/userprofile/"+author+"' class='pull-left thumb-sm avatar m-l-n-md'>             <img src='/suite/plugins/servlet/loadsource/3/"+author+".png' class='img-circle' alt='...'>           </a>           <div class='m-l-lg panel b-a'>             <div class='panel-heading pos-rlt b-b b-light'>               <span class='arrow left'></span>               <a href>"+authorName+"</a>               <label class='label bg-info m-l-xs'>"+authorTitle+"</label>               <span class='text-muted m-l-sm pull-right'>                 <i class='fa fa-clock-o'></i>                 "+createTimestamp+"               </span>             </div>             <div class='panel-body'>               <div>"+$("#content").val()+attachsDiv+"</div>             </div>           </div>         </div>"
                var note = "<tr><td><img src='/suite/plugins/servlet/loadsource/3/" + author + ".png' style='border-radius:2px;' width='30' height='30' >&nbsp;<a href='/suite/plugins/web/index.html#/app/userprofile/" + author + "' target='_blank' style='text-decoration:none;color: #428BCA;' >" + authorName + "</a></td><td>" + authorTitle + "</td><td>" + $("#content").val() + "</td><td>" + createTimestamp + "</td><td>" + attachsDiv + "</td></tr>"
                //$("#notesTbody").prepend(note);
                if ($("#notesTbody").text() == "") {
                    $("#notes").append('<div class="panel panel-default"><div class="panel-heading">评论</div><table class="table table-striped table-hover table-bordered"><thead><tr><th>评论人</th><th>职位</th><th>内容</th><th>评论时间</th><th>附件</th></tr></thead><tbody id="notesTbody"></tbody></table></div>');
                }
                $("#notesTbody").append(note);
                attachs = [];
                $("#content").val("");
                $("#at").val("");
                $("#notesDiscussion").remove();
                $("#attach>div").remove();
            }
        }
    }
    $scope.open = function (url, size) {
        var modalInstance = $uibModal.open({
            templateUrl: url,
            controller: 'ProcessModalInstanceCtrl',
            size: size
        });

    };
    $scope.setProcessSecurityRole = function (url, size) {
        $scope.open(url, size);
    };

    $scope.openAtUserList = function (url, size) {
        var modalInstance = $uibModal.open({
            templateUrl: url,
            controller: 'ProcessDetailAtUserListCtrl',
            size: size,
            scope: $scope
        });
    };
    $scope.setAt = function () {
        var content = $("#content").val();
        if (content.indexOf("@") > -1) {
            if (content.lastIndexOf("@") + 1 == content.length) {
                $("#content").blur();
                $scope.openAtUserList('atUserList.html');
            }
        } else if (content == "") {
            $("#at").val("");
        }

    }

}]);


function selectFile() {
    $("#file").click();
}


function selectedFile(thiss) {
    uploadFile(thiss, "", function (mes) {

        for (var i = 0; i < mes.length; i++) {
            attachs.push(mes[i]);
            var img = "";
            if (mes[i].suffix == "jpg" || mes[i].suffix == "png" || mes[i].suffix == "gif") {
                img = "<img src='/suite/doc/" + mes[i].id + "' style='height:80px;' >";
            } else {
                img = "<img src='/suite/plugins/img/attach/attach.png'  style='height:80px;' >";
            }
            var div = "<div id='attach" + mes[i].id + "'  class='panel b-a inline m-r-sm m-b-sm bg-light' >  <div class='wrapper-xs b-b'><i class='fa fa-paperclip'></i> " + mes[i].name + "&nbsp;<a class='btn btn-default' style='padding: 3px 6px;' onclick=deleteDocument('" + mes[i].id + "') ui-toggle-class='button'><i class='glyphicon glyphicon-remove'></i></a></div> <div class='wrapper-xs lt' style='height:100px;width:100%;text-align: center;' > 				<a href='/suite/doc/" + mes[i].id + "' >" + img + "</a> 			  </div> 			</div>"

            $("#attach").append(div);

        }

    })
}


function deleteDocument(id) {
    var rs = execute("deletedocument", {id: id});
    if (rs) {
        $("#attach" + id).remove();
        var attachsNew = [];
        for (var i = 0; i < attachs.length; i++) {
            if (attachs[i].id != id) {
                attachsNew.push(attachs[i]);
            }
        }
        attachs = attachsNew;
    }
}

angular.module('MaterialApp').controller('ProcessModalInstanceCtrl', ['$scope', '$uibModalInstance', '$state', function ($scope, $uibModalInstance, $state) {

    $scope.ok = function () {
        var selectUsers = mini.get("userAndGroup").getValue();
        var users = selectUsers.replaceAll(",", ";");
        setProcessSecurityRole(processId, users)
        $uibModalInstance.close();
        setTimeout(function () {
            $state.reload();
        }, 500);

    }
    $scope.cancel = function () {
        $uibModalInstance.close();
    };
}]);
angular.module('MaterialApp').controller('ProcessDetailAtUserListCtrl', ['$scope', '$uibModalInstance', '$state', function ($scope, $uibModalInstance, $state) {

    $scope.ok = function (id, name) {
        if ($("#at").val().length > 0) {
            $("#at").val($("#at").val() + "," + id);
        } else {
            $("#at").val(id);
        }
        $("#content").val($("#content").val() + "" + name + " ");
        $("#content").focus();
        $uibModalInstance.close();
    }
    $scope.cancel = function () {
        $uibModalInstance.close();
    };
}])
;

function setProcessSecurityRole(id, userOrGroup) {
    var flag = false;
    $.ajax({
        url: "/suite/plugins/servlet/execute/setprocesssecurityrole",
        type: "get",
        data: {id: id, userOrGroup: userOrGroup},
        async: false,
        success: function (text) {
            if (text == "true") {
                flag = true;
            } else {
                flag = false;
            }
        },
        error: function () {
            flag = false;
        }
    });
    return flag;
}

var attachs = [];
function sendProcessNote() {

    var author = user.userName;
    var authorName = user.firstName;
    var authorTitle = user.customField1;
    var processid = processId;
    var myDate = new Date();
    var createTimestamp = myDate.getFullYear() + "-" + myDate.getMonth() + "-" + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
    var content = $("#content").val();
    if (content != null && content != "") {
        var data;
        if (attachs.length == 0) {
            data = {id: processid, content: content};
        } else {
            data = {id: processid, content: content, attachs: attachs};
        }
        var at = $("#at").val();
        if (at != null && at != "") {
            if (attachs.length == 0) {
                data["attachs"] = "";
            }
            data["taskId"] = 0;
            data["at"] = at;
        }
        var rs = execute("createprocessnote", data);

        if (rs) {
            var attachsDiv = "<div style='margin-top:0px;'  >";
            var mes = attachs;
            for (var i = 0; i < mes.length; i++) {
                var img = "";
                if (mes[i].suffix == "jpg" || mes[i].suffix == "png" || mes[i].suffix == "gif") {
                    img = "<img src='/suite/doc/" + mes[i].id + "' style='height:30px;width:30px;border-radius:25%;' >";
                } else {
                    img = "<img src='/suite/plugins/img/attach/attach.png'  style='height:30px;width:30px;border-radius:25%;' >";
                }
                attachsDiv += "<div id='attach" + mes[i].id + "'  class='panel b-a inline m-r-sm m-b-sm bg-light' >  <div class='wrapper-xs b-b'><i class='fa fa-paperclip'></i> " + mes[i].name + "</div> <div class='wrapper-xs lt' style='height:30px;width:100%;text-align: center;' > 				<a href='/suite/doc/" + mes[i].id + "' >" + img + "</a> 			  </div> 			</div>";
            }
            attachsDiv += "</div>"
            var note = "<tr><td><img src='/suite/plugins/servlet/loadsource/3/" + author + ".png' style='border-radius:2px;' width='30' height='30' >&nbsp;<a href='/suite/plugins/web/index.html#/app/userprofile/" + author + "' target='_blank' style='text-decoration:none;color: #428BCA;' >" + authorName + "</a></td><td>" + authorTitle + "</td><td style='text-align:left;'>" + $("#content").val() + "</td><td>" + createTimestamp + "</td><td>" + attachsDiv + "</td></tr>"
            //$("#notesTbody").prepend(note);
            if ($("#notesTbody").text() == "") {
                $("#notes").append('<div class="panel panel-default"><div class="panel-heading">评论</div><table class="table table-striped m-b-none"><thead><tr><th>评论人</th><th>职位</th><th>内容</th><th>评论时间</th><th>附件</th></tr></thead><tbody id="notesTbody"></tbody></table></div>');
            }
            $("#notesTbody").append(note);
            attachs = [];
            $("#content").val("");
            $("#notesDiscussion").remove();
            $("#attach>div").remove();
        }
    }
}
