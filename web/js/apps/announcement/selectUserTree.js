//获取浏览器页面可见高度和宽度
var _PageHeight = document.documentElement.clientHeight,
    _PageWidth = document.documentElement.clientWidth;
//计算loading框距离顶部和左部的距离（loading框的宽度为215px，高度为61px）
var _LoadingTop = _PageHeight > 61 ? (_PageHeight - 61) / 2 : 0,
    _LoadingLeft = _PageWidth > 215 ? (_PageWidth - 215) / 2 : 0;
//在页面未加载完毕之前显示的loading Html自定义内容
var _LoadingHtml = '<div id="loadingDiv" style="position:absolute;left:0;width:100%;height:' + _PageHeight + 'px;top:0;background:#f3f8ff;opacity:1;filter:alpha(opacity=80);z-index:10000;"><div style="position: absolute; cursor1: wait; left: ' + _LoadingLeft + 'px; top:' + _LoadingTop + 'px; width: auto; height: 57px; line-height: 57px; padding-left: 50px; padding-right: 5px; background: #000 url(/suite/plugins/processAndTasks/miniui3.6/themes/loader.gif) no-repeat scroll 5px 10px; border: 0px solid #95B8E7;-moz-border-radius:20px;-webkit-border-radius:20px;border-radius:20px; color: #696969; font-family:\'Microsoft YaHei\';">Loading pages...</div></div>';
//呈现loading效果
document.write(_LoadingHtml);

//window.onload = function () {
//    var loadingMask = document.getElementById('loadingDiv');
//    loadingMask.parentNode.removeChild(loadingMask);
//};

//监听加载状态改变
document.onreadystatechange = completeLoading;

//加载状态为complete时移除loading效果
function completeLoading() {
    if (document.readyState == "complete") {
        var loadingMask = document.getElementById('loadingDiv');
        loadingMask.parentNode.removeChild(loadingMask);
    }
}

mini.parse();
var issetdate = false;
var gid = "";
var key = "";
var siname1 = "";
var sql = ""
var siname2 = "";
var tree = mini.get("treeemp");
var grid = mini.get("gridemp");
var selectedgrid = mini.get("selectedgrid");
grid.setUrl("/suite/plugins/servlet/query/GM_searchUserPaging");
grid.on("load", function () {
});
//grid.load({name:""});
var arrayObj = new Array();
var selectMaps = {};
tree.on("nodeselect", function (e) {
    key = mini.get("key").value;
    var node = e.node;
    grid.setUrl("/suite/plugins/servlet/query/GM_getGroupUserUnderect");
    grid.sortBy("displayName", "asc");
    grid.load({groupId: node.bpmId});
});
grid.on("rowclick", function (e) {
    var row = e.record;
    if (grid.isSelected(row)) {

        var hasarray = inarray(row, arrayObj);
        if (hasarray < 0) {
            arrayObj.push(row);
        }
    } else {
        var hasarray = inarray(row, arrayObj);
        if (hasarray >= 0) {
            arrayObj.splice(hasarray, 1);
        }
    }
    grid.clearSelect(false);
    grid.selects(arrayObj, false);
    selectedgrid.removeAll();
    selectedgrid.addItems(arrayObj);
});
grid.on("headercellclick", function (e) {
    var rows = grid.getData();
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (grid.isSelected(row)) {
            var hasarray = inarray(row, arrayObj);
            if (hasarray < 0) {
                arrayObj.push(row);
            }
        } else {
            var hasarray = inarray(row, arrayObj);
            if (hasarray >= 0) {
                arrayObj.splice(hasarray, 1);
            }
        }
    }
    grid.deselectAll(false);
    grid.selects(arrayObj, true);
    selectedgrid.removeAll();
    selectedgrid.addItems(arrayObj);
});

/*function SetData(inputdata,callback){
 if(inputdata!=null){
 var info = eval('(' + inputdata + ')');
 siname1 = info.siname1;
 sql = info.sql;
 if(info.siname2==undefined){
 siname2 = "";
 }else{
 siname2 = info.siname2;
 }
 var inputdata = '{groupid:"",text:"",siname1:"'+siname1+'",sql:"'+sql+'",siname2:"'+siname2+'"}';
 var time = setInterval(function(){
 if(issetdate){
 grid.set({url:"/suite/plugins/servlet/query/KM_GetEmp?jsonstr="+encodeURI(inputdata)});
 grid.load();
 clearInterval(time);
 }
 },100);
 }
 if(callback){
 callback({tree:tree,grid:grid,selectedgrid:selectedgrid,arrayObj:arrayObj});
 }
 }*/

function SetData(data) {
    arrayObj = data;
    selectedgrid.addItems(arrayObj);

}

function GetData() {
    var rows = GetAllSelecteds();
    var ids = [], texts = [];
    for (var i = 0, l = rows.length; i < l; i++) {
        var row = rows[i];
        ids.push(row.userName);
        texts.push(row.firstName);
    }
    var data = {};
    data.id = ids.join("!");
    data.text = texts.join("!");
    return data;
}


function doFilter() {
    var name = mini.get("searchBox").value;
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
        grid.setUrl("/suite/plugins/servlet/query/GM_searchUserPaging");
        grid.load({name: name});

    }
}

function GetAllSelecteds() {
    selectedgrid.selectAll();
    return selectedgrid.getSelecteds();
}
function onGridLoad(e) {
    grid.selects(arrayObj, true);
}
function removeRow() {
    var rows = selectedgrid.getSelecteds();
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var hasarray = inarray(row, arrayObj);
        if (hasarray >= 0) {
            arrayObj.splice(hasarray, 1);
        }
    }
    grid.deselectAll(false);
    grid.selects(arrayObj, true);
    selectedgrid.removeAll();
    selectedgrid.addItems(arrayObj);
}
function back() {
    CloseWindow("cancel");
}
function submit() {
    onOk();
}

function search() {
    key = mini.get("key").value;
    //var url=encodeURI("/suite/plugins/servlet/query/GM_getSystemOrgization?name="+key);
    //tree.load(url);
    tree.filter(function (node) {
        if (node.text.indexOf(key) != -1) return true;
    });
    tree.expandAll();
}

function CloseWindow(action) {
    if (window.CloseOwnerWindow) return window.CloseOwnerWindow(action);
    else window.close();
}

function onOk() {
    CloseWindow("ok");
}
function onCancel() {
    CloseWindow("cancel");
}


function inarray(val, arr) {
    if (arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].userName == val.userName) return i;
        }
    }

    return -1;
};

var thekey = mini.get('key');
thekey.on("valuechanged", function () {
    search();
});

