var user = [];
var processNotes = [];
var tp = [];
var taskid = "";
var pm = "";
angular.module('MaterialApp')
    .controller('TaskDetailCtrl', ['$scope', '$stateParams', '$uibModal', '$state','processDetailFactory', function ($scope, $stateParams, $uibModal, $state,processDetailFactory) {
        $("#taskContent").attr("src", "/suite/plugins/servlet/viewtaskdetails?taskid=" + $stateParams.taskId)
        //user = eval("[" + execute("GM_getloginUserInfo") + "]")[0];
	$scope.taskId = $stateParams.taskId;
	taskid = $scope.taskId;
	processDetailFactory.getloginUserInfo();
	$scope.$on("loginuserInfoUpdata",function(event,data){
	user=data.data;
	$scope.user = user;	
	processDetailFactory.gettaskDetails($stateParams.taskId);
	})
	$scope.$on("taskDetailserviceUpdata",function(event,data){
			tp=data.data;
			$scope.tp = tp;
			$scope.taskProcessId = tp.processId;
			processDetailFactory.getProcessnotes(tp.processId);
			processDetailFactory.getProcessDetails(tp.processId);
			
			
		})
	$scope.$on("notesServiceUpdata",function(event,data){
		processNotes=data.data;
		$scope.processNotes = processNotes;
        var notes = processNotes;
        if (notes.length == 0) {
            $("#notes").append("<div id='notesDiscussion' style='width:100%;height:50px;padding-left:45%;padding-top:10px;' ><span  translate='common.noCommentsYetOhMessage'></span></div>")
        } else {
            var noteDivs = '<div class="panel panel-default"><div class="panel-heading">评论</div><table class="table table-striped m-b-none"><thead><tr><th>评论人</th><th>职位</th><th>内容</th><th>评论时间</th><th>附件</th></tr></thead><tbody id="notesTbody">'
            for (var i = 0; i < notes.length; i++) {
                if (notes[i].content != null) {
                    var content = notes[i].content.content
                    var attachsDiv = "";
                    var mes = notes[i].content.attachs;
                    if (mes != null) {
                        attachsDiv += "<div style='margin-top:0px;'  >";
                        for (var j = 0; j < mes.length; j++) {
                            var img = "";
                            if (mes[j].suffix == "jpg" || mes[j].suffix == "png" || mes[j].suffix == "gif") {
                                img = "<img src='/suite/doc/" + mes[j].id + "' style='height:30px;width:30px;border-radius:25%;' >";
                            } else {
                                img = "<img src='/suite/plugins/img/attach/attach.png'  style='height:30px;width:30px;border-radius:25%;' >";
                            }
                            attachsDiv += "<div id='attach" + mes[j].id + "'  class='panel b-a inline m-r-sm m-b-sm bg-light' >  <div class='wrapper-xs b-b'><i class='fa fa-paperclip'></i> " + mes[j].name + "</div> <div class='wrapper-xs lt' style='height:30px;width:100%;text-align: center;' > 				<a href='/suite/doc/" + mes[j].id + "' >" + img + "</a> 			  </div> 			</div>";
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
		})
	$scope.$on("processDetailserviceUpdata",function(event,data){
		
			pm=data.data;
			pp=data.data;
		$scope.pp=pp;
		$scope.participants = [];
        var participantIds = $scope.pp.participantIds.split(",");
        var participantNames = $scope.pp.participants.split(",");
        for (var i = 0; i < participantIds.length; i++) {
            if (participantIds[i] != "") {
                $scope.participants.push({id: participantIds[i], name: participantNames[i]})
            }
        }
		processDetailFactory.getprocessvariables(tp.processId);
		})
		
		$scope.$on("processvariablesUpdata",function(event,data){
			var countersignFlag =data.data;
				var showFlag = false;
        var showFlag1 = false;
        var showFlag2 = false;
        var showFlag3 = false;
        
		if (tp.status == 0 && user.userName != tp.assignees) {
            showFlag = true;
        }
        if (tp.status == 1 && user.userName == tp.owner || tp.status == 0 && user.userName == tp.assignees || user.userName == tp.owner && tp.status != 2) {
            showFlag1 = true;
        }
        if ((tp.status == 1 && user.userName == tp.owner || tp.status == 0 && user.userName == tp.assignees || user.userName == tp.owner && tp.status != 2 )&& $scope.pp.processModelName!="转发流程"&& $scope.pp.processModelName!="会签流程"&&countersignFlag!="开始会签" ) {
            showFlag2 = true;
        }
        if($scope.pp.processModelName!="转发流程"){
            showFlag3 = true;
        }
		$scope.showFlag = showFlag;
        $scope.showFlag1 = showFlag1;
        $scope.showFlag2 = showFlag2;
        $scope.showFlag3 = showFlag3;
		});
        $scope.taskSaveP = function () {
            document.getElementById("taskContent").contentWindow.taskSave();
        }

        $scope.reassignTask = function (url, size, type) {
            if (type == "转办") {
                var modalInstance = $uibModal.open({
                    templateUrl: url,
                    controller: 'TaskModalInstanceCtrl',
                    size: size,
                    resolve: {
                        type: function () {
                            return angular.copy("转办");
                            ;
                        }
                    }
                });
            } else {
                var modalInstance = $uibModal.open({
                    templateUrl: url,
                    controller: 'CountersignUserModalInstanceCtrl',
                    size: size,
                    resolve: {
                        type: function () {
                            return angular.copy("会签");
                            ;
                        }
                    },
                    scope: $scope
                });
            }
        };
        $scope.copyTask = function(url, size, type){
            var modalInstance = $uibModal.open({
                templateUrl: url,
                controller: 'TaskModalInstanceCtrl',
                size: size,
                resolve: {
                    type: function () {
                        return angular.copy("转发");
                        ;
                    }
                },
                scope: $scope
            });
        }
        $scope.setTaskPriority = function (id, priority) {

            var rs = setTaskPriority(id, priority);
            if (rs == "true") {
                setTimeout(function () {
                    $state.reload();
                }, 500);
            } else {
                alert("你没有权限！")

            }
        };

        $scope.acceptTasks = function (id) {

            var rs = acceptTask(id);
            if (rs == "true") {
                setTimeout(function () {
                    $state.reload();
                }, 500);
            } else {
                alert("你没有权限！")
            }
        };
        $scope.open = function (url, size) {
            var modalInstance = $uibModal.open({
                templateUrl: url,
                controller: 'TaskProcessModalInstanceCtrl',
                size: size
            });

        };
        $scope.setProcessSecurityRole = function (url, size) {
            $scope.open(url, size);
        };

        
        $scope.openAtUserList = function (url, size) {
            var modalInstance = $uibModal.open({
                templateUrl: url,
                controller: 'TaskProcessDetailAtUserListCtrl',
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

angular.module('MaterialApp').controller('TaskProcessDetailAtUserListCtrl', ['$scope', '$uibModalInstance', '$state', function ($scope, $uibModalInstance, $state) {

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
angular.module('MaterialApp').controller('TaskProcessModalInstanceCtrl', ['$scope', '$uibModalInstance', '$state', function ($scope, $uibModalInstance, $state) {

    $scope.ok = function () {
        var selectUsers = mini.get("userAndGroup").getValue();
        var users = selectUsers.replaceAll(",", ";");
        var processId = $("#taskProcessId").val();
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


angular.module('MaterialApp').controller('TaskModalInstanceCtrl', ['$scope', '$uibModalInstance', '$state', 'type', function ($scope, $uibModalInstance, $state, type) {

    $scope.type = type;
    $scope.ok = function () {

        var selectUsers = mini.get("userAndGroup").getValue();
        var tasksUsers = selectUsers;
        if (tasksUsers.indexOf(",") != -1) {
            tasksUsers = selectUsers.replaceAll(",", ";");
        }

        if($scope.type == "转办"){
            if ($("#taskId").val() == null) {
                if ($scope.type == "转办") {
                    var taskIds = $(".taskCheck:checked");
                    for (var i = 0; i < taskIds.length; i++) {
                        reassignTask(taskIds.eq(i).val(), tasksUsers)
                    }
                }
                $uibModalInstance.close();
                setTimeout(function () {
                    $state.reload();
                }, 500);
            } else {
                var name = query("GM_getLogInUserInfo", {userName: tp.owner[0]})[0].firstName;
                execute("createprocessnote", {id: tp.processId, content: name + "的转办任务"});
                reassignTask($("#taskId").val(), tasksUsers);
                setTimeout(function () {
                    $state.go('task', {fold: '-1'});
                }, 500);
                $uibModalInstance.close();
            }
        }else {

            var flag = setProcessSecurityRole(taskid, tasksUsers);
            if(flag){
                var processId = tp.processId;
                var processName = tp.processName;

                var taskId = String(taskid);
                var countersignUsers = tasksUsers;
                // add
                var countersignDesc = mini.get("userAndComments").getValue();
                // add

                var startUser = query("GM_getLogInUserInfo")[0].firstName;
                var data = {
                    countersignProcessId: processId,
                    countersignProcessName: processName,
                    countersignUsers: countersignUsers,
                    countersignDesc: countersignDesc,
                    taskId: taskId,
                    startUser: startUser
                };
                startCopyProcessNews("0590deb6-32c2-8000-a396-010000010000", {formData: mini.encode(data)})

            }else {
                alert("转发失败")
            }
            $uibModalInstance.close();

        }
    }
    $scope.cancel = function () {
        $uibModalInstance.close();
    };
}]);


angular.module('MaterialApp').controller('CountersignUserModalInstanceCtrl', ['$scope', '$uibModalInstance', '$state', 'type', function ($scope, $uibModalInstance, $state, type) {

    $scope.type = type;

    // $scope.selectUser = function (id, name) {
    //     if ($("#countersignUserId").val().length > 0) {
    //         $("#countersignUserId").val($("#countersignUserId").val() + "," + id);
    //     } else {
    //         $("#countersignUserId").val(id);
    //     }
    //     $("#countersignUserNmae").val($("#countersignUserNmae").val() + "  " + name + " ");
    //     $("#countersignUserNmae").focus();
    // }


    $scope.ok = function () {
        // var selectUsers = $("#countersignUserId").val();
        var selectUsers = mini.get("userAndGroup").getValue();
        var tasksUsers = selectUsers;
        if (tasksUsers.indexOf(",") != -1) {
            tasksUsers = selectUsers.replaceAll(",", ";");
        }
        if ($("#taskId").val() == null) {
            if ($scope.type == "转办") {
                var taskIds = $(".taskCheck:checked");
                for (var i = 0; i < taskIds.length; i++) {
                    reassignTask(taskIds.eq(i).val(), tasksUsers)
                }
            }
            $uibModalInstance.close();
            setTimeout(function () {
                $state.reload();
            }, 500);
        } else {
            var processId = tp.processId;
            var processName = tp.processName;

            var taskId = String(taskid);
            var countersignUsers = tasksUsers;
            var countersignDesc = mini.get("userAndComments").getValue();

            var startUser = query("GM_getLogInUserInfo")[0].firstName;
            var data = {
                countersignProcessId: processId,
                countersignProcessName: processName,
                countersignUsers: countersignUsers,
                countersignDesc:countersignDesc,
                taskId: taskId,
                startUser: startUser
            };
            startProcessNews("0006deaa-c4d1-8000-9e06-010000010000", {formData: mini.encode(data)})

            $uibModalInstance.close();


        }
    }
    $scope.cancel = function () {
        $uibModalInstance.close();
    };
}]);

function onButtonEdit1(e) {
    var wi = Number($(document.body).outerWidth(true)) - 300;
    var hi = Number($(document.body).outerHeight(true)) - 600;
    if (hi > 600) {
        hi = 450;
    }
    mini.open({
        url: "/suite/plugins/servlet/loadsource/3608/selectUserTree.html",
        title: "北京科园组织架构选人",
        width: wi,
        height: hi,
        allowResize: true,
        allowDrag: true,
        showCloseButton: true,
        showMaxButton: true,
        showModal: true,
        ondestroy: function (action) {

            if (action == "ok") {
                var iframe = this.getIFrameEl();
                var data = iframe.contentWindow.GetData();
                data = mini.clone(data);
                var users = data.id.replaceAll("!", ";");
                var processId = $("#taskProcessId").val();
                setProcessSecurityRole(processId, users)

            }
        }
    });

}


function taskCheck(thiss) {
    if ($(thiss).attr("checked") == null) {
        $(thiss).attr("checked", true);
        $(thiss).next("i").append("<i class='newCheckedI' style='top: 4px;left: 4px;width: 10px;height: 10px;background-color: #23B7E5;position: absolute;'></i>");
    } else {
        $(thiss).attr("checked", false);
        $(thiss).next("i").css("border-color", "");
        $(thiss).next("i").css("background-color", "");
        $(thiss).next("i").find(".newCheckedI").remove();
    }
}


function acceptTask(id) {
    var flag = false;
    $.ajax({
        url: "/suite/plugins/servlet/execute/accepttask",
        type: "get",
        async: false,
        data: {"id": id},
        success: function (text) {
            flag = text;
        },
        error: function () {
            flag = false;
        }
    });
    return flag;
}

function reassignTask(id, userOrGroup) {
    var flag = false;
    $.ajax({
        url: "/suite/plugins/servlet/execute/reassigntask",
        type: "get",
        data: {id: id, userOrGroup: userOrGroup},
        async: false,
        success: function (text) {
            flag = text;
        },
        error: function () {
            flag = false;
        }
    });
    return flag;
}

function setTaskPriority(id, priority) {
    var flag = false
    $.ajax({
        url: "/suite/plugins/servlet/execute/settaskpriority",
        type: "get",
        data: {id: id, priority: priority},
        async: false,
        success: function (text) {
            flag = text;
        },
        error: function () {
            flag = false;
        }
    });
    return flag;
}


function completeTasks(id, data) {
    data["activityId"] = id;
    data["isSubmit"] = true;
    var flag = false;
    $.ajax({
        url: "/suite/plugins/servlet/SetTaskActiveVariable",
        type: "get",
        data: data,
        async: false,
        success: function (text) {
            if (text == "0") {
                flag = false;
            } else if (text == "1") {
                flag = true;

            } else {
                flag = true;
            }
        },
        error: function () {
            flag = false;
        }
    });

}

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

function selectFile() {
    $("#file").click();
}


var attachs = [];

function sendProcessNote() {

    var author = user.userName;
    var authorName = user.firstName;
    var authorTitle = user.customField1;
    var processid = tp.processId;
    var myDate = new Date();
    var createTimestamp = myDate.getFullYear() + "-" + (Number(myDate.getMonth()) + 1) + "-" + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
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

function selectedFile(thiss) {
    uploadFile(thiss,"",function (mes) {

        for (var i = 0; i < mes.length; i++) {
            attachs.push(mes[i]);
            var img = "";
            if (mes[i].suffix == "jpg" || mes[i].suffix == "png" || mes[i].suffix == "gif") {
                img = "<img src='/suite/doc/" + mes[i].id + "' style='height:80px;' >";
            } else {
                img = "<img src='/suite/plugins/img/attach/attach.png'  style='height:80px;' >";
            }
            var div = "<div id='attach" + mes[i].id + "'  class='panel b-a inline m-r-sm m-b-sm bg-light' >  <div class='wrapper-xs b-b'><i class='fa fa-paperclip'></i> " + mes[i].name + "&nbsp;<a class='btn btn-default' style='padding: 3px 6px;' onclick=deleteDocument('" + mes[i].id + "') ui-toggle-class='button'><i class='glyphicon glyphicon-remove'></i></a></div> <div class='wrapper-xs lt' > 				<a href='/suite/doc/" + mes[i].id + "' >" + img + "</a> 			  </div> 			</div>"

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
$("#taskContent").load(function () {
    var mainheight = $(this).contents().find("body").height() + 10000;
    $(this).height(mainheight);
});

function startProcessNews(uuid, data) {
    $("body").append("<div  style='top:0px;left:0px;position:absolute;width:100%;height:100%;filter:alpha(Opacity=80);-moz-opacity:0.5;opacity: 0.5;z-index:100; background-color:#ffffff;' ><img src='/suite/plugins/img/loading/loading.gif' style='position:absolute;left:48%;top:10%;width:40px;height:40px;' /></div>")
    data["uuid"] = uuid;
    var messageid = mini.loading("会签发送中...", "Loading");
    $.ajax({
        url: "/suite/plugins/servlet/SetProcessActiveVariable",
        type: "post",
        data: data,
        async: false,
        success: function (rs) {
            if (rs != null && rs != "") {
                mini.showTips({
                    content: "<b>成功</b> <br/>会签发送成功",
                    state: "success",
                    x: "center",
                    y: "center",
                    timeout: 6000
                })
                setTimeout(function () {
                    mini.hideMessageBox(messageid);
                    window.parent.location.href = "/suite/plugins/web/index.html#/task/inbox/0";
                    window.parent.location.reload();
                }, 4000);
            }
        },
        error: function () {
            mini.showTips({
                content: "<b>失败</b> <br/>会签发送失败",
                state: "danger",
                x: "center",
                y: "center",
                timeout: 2000
            });
        }
    });

}

function startCopyProcessNews(uuid, data) {
    $("body").append("<div  style='top:0px;left:0px;position:absolute;width:100%;height:100%;filter:alpha(Opacity=80);-moz-opacity:0.5;opacity: 0.5;z-index:100; background-color:#ffffff;' ><img src='/suite/plugins/img/loading/loading.gif' style='position:absolute;left:48%;top:10%;width:40px;height:40px;' /></div>")
    data["uuid"] = uuid;
    var messageid = mini.loading("转发发送中...", "Loading");
    $.ajax({
        url: "/suite/plugins/servlet/SetProcessActiveVariable",
        type: "post",
        data: data,
        async: false,
        success: function (rs) {
            if (rs != null && rs != "") {
                mini.showTips({
                    content: "<b>成功</b> <br/>转发发送成功",
                    state: "success",
                    x: "center",
                    y: "center",
                    timeout: 6000
                })
                setTimeout(function () {
                    mini.hideMessageBox(messageid);
                    window.parent.location.href = "/suite/plugins/web/index.html#/task/inbox/0";
                    window.parent.location.reload();
                }, 4000);
            }
        },
        error: function () {
            mini.showTips({
                content: "<b>失败</b> <br/>转发发送失败",
                state: "danger",
                x: "center",
                y: "center",
                timeout: 2000
            });
        }
    });

}