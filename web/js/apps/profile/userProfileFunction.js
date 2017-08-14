mini.parse();
var treeExportData = [];
var tree = mini.get("tree1");
var grid = mini.get("grid1");
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
//grid.setUrl("/suite/plugins/servlet/query/GM_searchUserPaging");
grid.on("load", function () {
});
//grid.load({name:""});

angular.module('MaterialApp')
    .controller('TabsDemoCtrl', ['$scope', '$http', '$rootScope', '$state', function ($scope, $http, $rootScope, $state) {

        $scope.reloadPage = function () {

            $state.reload();
        }
        var grouInfos = {groupName: "收发文流程节点配置"};
        $scope.grouInfos = grouInfos;
        tree.on("nodeclick", function (e) {
            var node = e.node;
            grid.setUrl("/suite/plugins/servlet/query/GM_getGroupUser");
            grid.load({groupId: node.bpmId});
            grouInfos = query("GM_getgroupAllInfos", {groupId: node.bpmId})[0];
//alert(mini.encode(grouInfos));
            $scope.$apply(function () {
                $scope.grouInfos = grouInfos;
            });
        });
    }]);

$("#search").bind("keypress", function () {
    var url = encodeURI("/suite/plugins/servlet/query/GM_getSystemOrgization?name=" + $("#search").val());
    tree.load(url);
});


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

function onActionRenderer(e) {
    var grid = e.sender;
    var record = e.record;
    var uid = record._uid;
    var rowIndex = e.rowIndex;

    var s = '<a class="New_Button"  href="javascript:addRow()"><span class="icon-add" plain="false" style="padding-left:20px;" >新增</span></a>&nbsp;&nbsp;'
        + ' <a class="Delete_Button"  href="javascript:delRow(\'' + uid + '\')"><span class="icon-remove" plain="false" style="padding-left:20px;" >删除</span></a>&nbsp;&nbsp;';

    return s;
}

function delRow(row_uid) {

    var row = grid.getRowByUID(row_uid);
    if (row) {
        if (confirm("确定删除此记录？")) {
            grid.loading("删除中，请稍后......");
            var num = execute("GM_addOrRemoveGroupMembers", {
                "groupId": tree.getSelectedNode().bpmId,
                "users": row.userName,
                "flag": true
            });
            if (num) {
                grid.setUrl("/suite/plugins/servlet/query/GM_getGroupUser");
                grid.load({groupId: tree.getSelectedNode().bpmId});
            }
        }
    }
}

function delRows() {
    var users = [];
    var rows = grid.getSelecteds();

    if (rows.length > 0) {
        for (var i = 0; i < rows.length; i++) {
            users.push(rows[i].userName);
        }
        if (confirm("确定删除此记录？")) {
            grid.loading("删除中，请稍后......");
            var num = execute("GM_addOrRemoveGroupMembers", {
                "groupId": tree.getSelectedNode().bpmId,
                "users": users.join("!"),
                "flag": true
            });
            if (num) {
                grid.setUrl("/suite/plugins/servlet/query/GM_getGroupUser");
                grid.load({groupId: tree.getSelectedNode().bpmId});
            }
        }
    } else {
        alert("请选择至少一条记录！！");
        return;
    }
}

function addRow() {
    var groPid = tree.getSelectedNode();
    var isLeaf = tree.isLeaf(groPid);
    if (!isLeaf) {
        alert("该功能只能选择子组！");
        return;
    }
    if (!groPid) {
        alert("请先选择组！！");
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
                grid.loading("添加中，请稍后......");
                var num = execute("GM_addOrRemoveGroupMembers", {
                    "groupId": tree.getSelectedNode().bpmId,
                    "users": data.id,
                    "flag": false
                });
                if (num) {
                    grid.setUrl("/suite/plugins/servlet/query/GM_getGroupUser");
                    grid.load({groupId: tree.getSelectedNode().bpmId});
                }
            }
        }
    });

}

grid.on("drawcell", function (e) {
    var record = e.record;
    var column = e.column;
    var field = e.field;
    var value = e.value;
    var rowIndex = e.rowIndex;
    if (field == "userName") {
        if (value != null && value != "") {
            e.cellHtml = "&nbsp;&nbsp;<img src='/suite/plugins/servlet/loadsource/3/" + record.userName + ".png' style='border-radius:2px;' width='30' height='30' >&nbsp;<a href='/suite/plugins/web/index.html#/profile/dashboard/" + record.userName + "' target='_blank' style='text-decoration:none;color: #428BCA;' >" + record.userName + "</a>"
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
    var searchUserInfo = mini.get("searchUserInfo").getValue();
    grid.setUrl("/suite/plugins/servlet/query/GM_searchUserPaging");
    grid.load({name: searchUserInfo});
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
