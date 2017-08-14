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
    var node=e.node;
    grid.setUrl("/suite/plugins/servlet/query/GM_getGroupUser");
    grid.sortBy("displayName","asc");
    grid.load({groupId:node.bpmId});
});
grid.on("rowclick",function(e){
    var row=e.record;
    if(grid.isSelected(row)){

        var hasarray = inarray(row,arrayObj);
        if(hasarray<0){
            arrayObj.push(row);
        }
    }else{
        var hasarray = inarray(row,arrayObj);
        if(hasarray>=0){
            arrayObj.splice(hasarray,1);
        }
    }
    grid.clearSelect(false);
    grid.selects(arrayObj,false);
    selectedgrid.removeAll();
    selectedgrid.addItems(arrayObj);
});
grid.on("headercellclick",function(e){
    var rows  =  grid.getData();
    for(var i = 0;i<rows.length;i++){
        var row = rows[i];
        if(grid.isSelected(row)){
            var hasarray = inarray(row,arrayObj);
            if(hasarray<0){
                arrayObj.push(row);
            }
        }else{
            var hasarray = inarray(row,arrayObj);
            if(hasarray>=0){
                arrayObj.splice(hasarray, 1);
            }
        }
    }
    grid.deselectAll(false);
    grid.selects(arrayObj,true);
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

function SetData(data){
    arrayObj=data;
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

function doFilter(){
    var name =mini.get("searchBox").value;
    var node = tree.getSelectedNode();
    if(node){
        grid.filter(function (row) {
            var r1 = true;
            if (name) {
                r1 = (String(row.firstName).indexOf(name) != -1)||(String(row.userName).indexOf(name) != -1);
            }
            return r1;
        });
    }else{
        //grid.setUrl("/suite/plugins/servlet/query/GM_searchUserPaging");
        //grid.load({name:name});

    }
}

function GetAllSelecteds() {
    selectedgrid.selectAll();
    return selectedgrid.getSelecteds();
}
function onGridLoad(e) {
    grid.selects(arrayObj,true);
}
function removeRow(){
    var rows = selectedgrid.getSelecteds();
    for(var i = 0;i<rows.length;i++) {
        var row = rows[i];
        var hasarray = inarray(row,arrayObj);
        if(hasarray>=0){
            arrayObj.splice(hasarray, 1);
        }
    }
    grid.deselectAll(false);
    grid.selects(arrayObj,true);
    selectedgrid.removeAll();
    selectedgrid.addItems(arrayObj);
}
function back(){
    CloseWindow("cancel");
}
function submit(){
    onOk();
}

function search(){
    key = mini.get("key").value;
    var url=encodeURI("/suite/plugins/servlet/query/GM_getSystemOrgization?name="+key);
    tree.load(url);
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


function inarray(val,arr) {
    if(arr){
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].userName == val.userName) return i;
        }
    }

    return -1;
};

var thekey = mini.get('key');
thekey.on("valuechanged",function(){
    search();
});
