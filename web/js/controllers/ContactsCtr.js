mini.parse();
var treeExportData = [];

var tree = mini.get("tree1");
var grid = mini.get("grid1");
/*var isAdmin = execute("GM_hasAdminFunction", {});*/
var isAdmin = false;
var userInfo = {};
angular.module('MaterialApp').controller('ContactsCtr', ['$scope', '$http', '$rootScope', '$state', function ($scope, $http, $rootScope, $state) {

    $scope.reloadPage = function () {

        $state.reload();
    }
    $scope.isAdmin = isAdmin;
    userInfo = $rootScope.userInfo;


    if (isAdmin == "false") {
        mini.get("formEx").hide();
        mini.get("tresEx").hide();
        grid.hideColumn(grid.getColumn("action"));
    } else {
        mini.get("formEx").show();
        mini.get("tresEx").show();
    }

    grid.set({
        showPager: true,
        sizeList: [50, 100, 500, 1000],
        pageSize: 100,
        sortMode: "server",
        multiSelect: true,
        allowCellEdit: false,
        allowCellSelect: false,
        onlyCheckSelection: true,
        allowRowSelect: false
    });
    grid.setUrl("/suite/plugins/servlet/query/GM_searchUserPaging");
    grid.on("load", function () {
    });
    if (isAdmin == "true") {
        grid.load({name: ""});
    }
    var grouInfos = {groupName: "太保资产公司企业通讯录"};

    $scope.grouInfos = grouInfos;
    tree.on("nodeclick", function (e) {
        var node = e.node;
        grid.setUrl("/suite/plugins/servlet/query/GM_getGroupUserUnderect");
        grid.sortBy("displayName", "asc");
        grid.load({groupId: node.bpmId});
        grouInfos = query("GM_getgroupAllInfos", {groupId: node.bpmId})[0];
//alert(mini.encode(grouInfos));
        $scope.$apply(function () {
            $scope.grouInfos = grouInfos;
        });
    });
}]);

function onActionRenderer(e) {
    var grid = e.sender;
    var record = e.record;
    //var s = '<a class="btn blue btn-xs"  href="javascript:void(0)" onclick="openWin('+record.threadId+')" >查看<i class="fa fa-search"></i></a>';
    var s = '';
    if (isAdmin == "true") {
        s = '<a class="btn red btn-xs" data-target="#stack1" data-toggle="modal" href="javascript:void(0)" onclick=updatePwd("' + record.userName + '","' + record.firstName + '") >修改密码</a>&nbsp;';
        s += '<a class="btn blue btn-xs" href="javascript:void(0)" onclick=forbidden("' + record.userName + '") >禁用用户</a>';
    }
    return s;
}
$("#search").bind("keypress", function () {
    var key = $("#search").val();
    //var url=encodeURI("/suite/plugins/servlet/query/GM_getSystemOrgization?name="+$("#search").val());
    //tree.load(url);
    tree.filter(function (node) {
        if (node.text.indexOf(key) != -1) return true;
    });
    tree.expandAll();
});

function updatePwd(userN, firstN) {
    $("#userName").val(userN);
    $("#firstName").val(firstN);
}
function forbidden(userName) {
    mini.confirm("确定禁用？", "确定？",
        function (action) {
            if (action == "ok") {
                var userState = execute("GM_forbiddenUser", {name: userName});
                if (userState == "true") {
                    alert("禁用成功！");
                    grid.load({name: ""});
                } else {
                    alert("禁用失败！");
                }
            }
        }
    );
}

function submitFo1() {
    var userN = $("#userName").val();
    var newPwd = $("#newPwd").val();
    var newLastPwd = $("#newLastPwd").val();
    if (newPwd != "") {
        if (newPwd != newLastPwd) {
            alert("密码要一致！")
        } else {
            var data = {userName: userN, newPwd: newPwd};
            var progressId = startProcessPwd("0003de3e-a229-8000-9e06-010000010000", {formData: mini.encode(data)});
        }
    } else {
        alert("密码不能为空！")
    }
}

function onDrawNode(e) {
    var tree = e.sender;
    var node = e.node;

    var isLeaf = tree.isLeaf(node);

    //所有子节点加上超链接
    //if (isLeaf == true) {
    // e.nodeHtml = '<a href="http://www.miniui.com/docs/api/' + node.id + '.html" target="_blank">' + node.text + '</a>';
    //}

    //父节点高亮显示；子节点斜线、蓝色、下划线显示
    if (isLeaf == false) {
        e.nodeStyle = 'font-weight:bold;';
    } else {
        e.nodeStyle = "font-style:italic;"; //nodeStyle
        e.nodeCls = "blueColor";            //nodeCls
    }

    //修改默认的父子节点图标
    if (isLeaf == false) {
        e.iconCls = "myspace";
    } else {
        e.iconCls = "user";
    }


    //父节点的CheckBox全部隐藏
    if (isLeaf == false) {
        e.showCheckBox = false;
    }
}


function getForm() {
    var form_data = {
        userName: $("#userName").val(),
        firstName: $("#firstName").val(),
        middleName: $("#middleName").val(),
        lastName: $("#lastName").val(),
        email: $("#email").val(),
        titleName: $("#titleName").val(),
        typeId: $("#typeId").val(),
        groupName: $("#groupName").val(),
        supervisorName: $("#supervisorName").val(),
        phoneOffice: $("#phoneOffice").val(),
        phoneMobile: $("#phoneMobile").val(),
        phoneHome: $("#phoneHome").val(),
        address1: $("#address1").val(),
        address2: $("#address2").val(),
        address3: $("#address3").val(),
        city: $("#city").val(),
        province: $("#province").val(),
        zipCode: $("#zipCode").val(),
        country: $("#country").val(),
        customField1: $("#customField1").val(),
        customField2: $("#customField2").val(),
        customField3: $("#customField3").val(),
        customField4: $("#customField4").val(),
        customField5: $("#customField5").val(),
        customField6: $("#customField6").val(),
        customField7: $("#customField7").val(),
        customField8: $("#customField8").val(),
        customField9: $("#customField9").val(),
        customField10: $("#customField10").val()
    };
    return form_data;
}

function onAddBefore(e) {
    var tree = mini.get("tree1");
    var node = tree.getSelectedNode();
    var newNode = {};
    tree.addNode(newNode, "before", node);
    saveData();
}


grid.on("drawcell", function (e) {
    var record = e.record;
    var column = e.column;
    var field = e.field;
    var value = e.value;
    var rowIndex = e.rowIndex;
    if (field == "userName") {
        if (record.userName == userInfo.userName) {
            e.cellHtml = "&nbsp;&nbsp;<img src='/suite/plugins/servlet/loadsource/3/" + record.userName + ".png' style='border-radius:2px;' width='30' height='30' >&nbsp;<a href='/suite/plugins/web/index.html#/profile/dashboard'style='text-decoration:none;color: #428BCA;'>" + record.userName + "</a>"
        } else {
            e.cellHtml = "&nbsp;&nbsp;<img src='/suite/plugins/servlet/loadsource/3/" + record.userName + ".png' style='border-radius:2px;' width='30' height='30' >&nbsp;<a href='/suite/plugins/web/index.html#/userProfile/" + record.userName + "'style='text-decoration:none;color: #428BCA;' >" + record.userName + "</a>"
        }
    }
});


function filter() {
    var tree = mini.get("tree1")

    var text = document.getElementById("search").value;

    var msgid = mini.loading("数据查询中，请稍后......");
    var lsitData = query("GM_getSystemOrglizationAsTree", {userName: text});
    if (lsitData.length > 0) {
        tree.loadList(lsitData);
        tree.expandAll();
        mini.hideMessageBox(msgid);
    }
}


function filterData() {
    var text = document.getElementById("search").value;
    var lsitData = query("GM_getSystemOrgization", {name: text});
    if (lsitData.length > 0) {
        return lsitData;
    }
}
function onAddAfter(e) {
    var tree = mini.get("tree1");
    var node = tree.getSelectedNode();

    var newNode = {};
    tree.addNode(newNode, "after", node);
    saveData();
}

function onAddNode(e) {
    var tree = mini.get("tree1");
    var node = tree.getSelectedNode();

    var newNode = {};
    tree.addNode(newNode, "add", node);
    saveData();
}

function onEditNode(e) {
    var tree = mini.get("tree1");
    var node = tree.getSelectedNode();

    tree.beginEdit(node);
}

function upDateNode(options) {
    var tree = mini.get("tree1");
    var node = tree.getSelectedNode();
    options = mini.clone(options);
    tree.updateNode(node, options)
    saveData();
}

function onEditNode2(e) {
    var tree = mini.get("tree1");
    var node = tree.getSelectedNode();

    mini.open({
        url: bootPATH + "../demo/tree/taskPanel/taskPanel.html",
        title: "任务面板", width: 500, height: 300,
        onload: function () {
            var iframe = this.getIFrameEl();
            iframe.contentWindow.SetData(node);
        }
    })
}

function searchUserIn() {
    var name = mini.get("searchUserInfo").getValue();
    var node = tree.getSelectedNode();
    if (node) {
        grid.filter(function (row) {
            var r1 = true;
            if (name) {
                r1 = (String(row.firstName).indexOf(name) != -1) || (String(row.userName).indexOf(name) != -1);
            }
            return r1;
        });
    } else {
        if (isAdmin == "true") {
            grid.setUrl("/suite/plugins/servlet/query/GM_searchUserPaging");
            grid.load({name: name});
        }
    }
}


function onRemoveNode(e) {

    var tree = mini.get("tree1");
    var node = tree.getSelectedNode();

    if (node) {
        if (confirm("确定删除选中节点?")) {
            tree.removeNode(node);
            saveData();
        }
    }
}

function formExcelexport() {
    var id = "userInfo";
    var columns = grid.getColumns();
    var headerNames = [];
    var headerNameTitles = [];
    var data = grid.getData();
    if (data == "" || data == null) {
        data = [];
    }
    data = mini.encode(data);
    for (var i = 0; i < columns.length; i++) {
        var headerName = columns[i].header;
        var field = columns[i].field;
        if (field != null) {
            if (headerName.indexOf("<") > -1) {
                headerName = headerName.substring(0, headerName.indexOf("<"));
                headerNames.push(field);
                headerNameTitles.push(headerName);
            } else {
                headerNames.push(field);
                headerNameTitles.push(headerName);
            }
        }
    }
    $("#excelexportIframe" + id).remove();
    $("#excelexportForm" + id).remove();
    var iframe = $("body").append("<iframe id='excelexportIframe" + id + "' name='excelexportIframe" + id + "' style='display:none;'  ></iframe>");
    var form = $('<form  action="/suite/plugins/servlet/ExportExcelServlet" method="POST" name="excelexportForm' + id + '" id="excelexportForm' + id + '" target="excelexportIframe' + id + '" ></form>');
    $('<input type="hidden" name="fileName" value="通讯录员工" />').appendTo(form);
    $('<input type="hidden" name="header" value="' + headerNames + '" />').appendTo(form);
    $('<input type="hidden" name="headerTitle" value="' + headerNameTitles + '" />').appendTo(form);
    $("<input type='hidden' name='data' value='" + data + "' />").appendTo(form);
    $(form).css('position', 'absolute');
    $(form).css('top', '-1200px');
    $(form).css('left', '-1200px');
    $(form).appendTo('body');
    $("#excelexportForm" + id).submit();
}

function treeExcelexport() {
    var id = "treeInfo";
    var columns = [{header: "排序号", field: "id"}, {header: "名称", field: "text"}, {
        header: "描叙",
        field: "desc"
    }, {header: "组编号", field: "bpmId"}];
    var headerNames = [];
    var headerNameTitles = [];
    var data = filterData();
    if (data == "" || data == null) {
        data = [];
    }
    var data = mini.encode(data);
    for (var i = 0; i < columns.length; i++) {
        var headerName = columns[i].header;
        var field = columns[i].field;
        headerNames.push(field);
        headerNameTitles.push(headerName);

    }
    $("#excelexportIframe" + id).remove();
    $("#excelexportForm" + id).remove();
    var iframe = $("body").append("<iframe id='excelexportIframe" + id + "' name='excelexportIframe" + id + "' style='display:none;'  ></iframe>");
    var form = $('<form  action="/suite/plugins/servlet/ExportExcelServlet" method="POST" name="excelexportForm' + id + '" id="excelexportForm' + id + '" target="excelexportIframe' + id + '" ></form>');
    $('<input type="hidden" name="fileName" value="通讯录架构" />').appendTo(form);
    $('<input type="hidden" name="header" value="' + headerNames + '" />').appendTo(form);
    $('<input type="hidden" name="headerTitle" value="' + headerNameTitles + '" />').appendTo(form);
    $("<input type='hidden' name='data' value='" + data + "' />").appendTo(form);
    $(form).css('position', 'absolute');
    $(form).css('top', '-1200px');
    $(form).css('left', '-1200px');
    $(form).appendTo('body');
    $("#excelexportForm" + id).submit();
}


function traverse(node, i) {
    treeExportData.push({id: node.id, text: node.text, desc: node.desc, bpmId: node.bpmId});
    var children = node.children;
    if (children != null) {
        var newData = {
            id: children[i].id,
            text: children[i].text,
            desc: children[i].desc,
            bpmId: children[i].bpmId
        };
        treeExportData.push(newData);
        if (i == children.length - 1) {
            traverse(children[0], 0);
        } else {
            traverse(node, i + 1);
        }
    }
}


function saveData() {
    var tree = mini.get("tree1");
    var data = tree.getData();
    var json = mini.encode(data);

    alert("在线演示，不提供保存，下载开发包内有此功能。");

}

function startProcessPwd(uuid, data) {
    //$("body").append("<div  style='top:0px;left:0px;position:absolute;width:100%;height:100%;filter:alpha(Opacity=80);-moz-opacity:0.5;opacity: 0.5;z-index:100; background-color:#ffffff;' ><img src='/suite/plugins/img/loading/loading.gif' style='position:absolute;left:48%;top:10%;width:40px;height:40px;' /></div>")
    data["uuid"] = uuid;
    $.ajax({
        url: "/suite/plugins/servlet/SetProcessActiveVariable",
        type: "post",
        data: data,
        async: false,
        success: function (rs) {
            if (rs != null && rs != "") {
                alert("密码修改成功！");
            }
        },
        error: function () {

        }
    });

}

// 无效用户
mini.parse();
var gridContact = mini.get("datagrid1");
gridContact.set({
    showPager: true,
    sizeList: [50, 100, 500, 1000],
    pageSize: 100,
    sortMode: "server ",
    multiSelect: true,
    allowCellEdit: false,
    allowCellSelect: false,
    onlyCheckSelection: true,
    allowRowSelect: false
});

if (isAdmin == "true") {
    gridContact.setUrl("/suite/plugins/servlet/query/GM_getDeactiveUser");
    gridContact.load({name: ""});
}


gridContact.on("drawcell", function (e) {
    var field = e.field;
    if (field == "action") {
        e.cellHtml = '<a class="btn red btn-xs" href="javascript:void(0)" onclick=confirmClick("' + e.record.userName
            + '")>激活用户</a>';
    }
})


function confirmClick(userName) {
    mini.confirm("确定激活？", "确定？",
        function (action) {
            if (action == "ok") {
                var userState = execute("GM_setUserActived", {name: userName});
                if (userState == "true") {
                    alert("激活成功！");
                    $("#searchBox").val("");
                    gridContact.load({name: ""});
                } else {
                    alert("激活失败！");
                }
            }
        }
    );
}


// 查询无效人员
function search() {
    var name = $("#searchBox").val();
    gridContact.load({name: name});
}