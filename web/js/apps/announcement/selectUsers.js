    mini.parse();

var grid = mini.get("grid1");

grid.set({showPager:true,sizeList:[50,100,500,1000],pageSize:100,sortMode:"server",multiSelect:true,allowCellEdit:false,allowCellSelect:false});
grid.setUrl("/suite/plugins/servlet/query/GM_searchUserPaging");
grid.on("load", function () {
});
grid.load({name:""});

function GetSelecteds() {
    var rows = grid.getSelecteds();
    return rows;
}
function GetData() {
    var rows = grid.getSelecteds();
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

function search() {
    var key = mini.get("key").getValue();
    grid.load({ name: key });
}
function onKeyEnter(e) {
    search();
}
//////////////////////////////////
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


