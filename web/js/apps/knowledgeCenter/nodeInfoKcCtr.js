
angular.module('MaterialApp').controller('nodeInfoKcCtr', ['$scope', '$stateParams','$uibModal','$state', function($scope, $stateParams,$uibModal,$state) {
    var nodeId=$stateParams.nodeId;
    var nodeName=$stateParams.nodeName;
    $("#headText").html(nodeName);
    mini.parse();
    var grid = mini.get("datagrid1");
    grid.set({showPager:true,sizeList:[20,50,100,500,1000],pageSize:20});
    grid.setUrl("/suite/plugins/servlet/query/GM_getCommunityChilds");
    grid.load({nodeId:nodeId,startIndex:grid.getPageIndex(),patchSize:grid.getPageSize()});

    grid.on("drawcell", function (e) {
        var record = e.record,
            column = e.column,
            field = e.field,
            value = e.value;
        if (field == "name") {
            if(record.type==2){
                e.cellHtml = "<a href='javascript:void(0)'  onclick=openWin3(\""+record.id+"\",\""+record.name+"\")><i class='icon-folder'></i>&nbsp;&nbsp;&nbsp;"+value+"</a>";
            }else if(record.type==1){

                e.cellHtml = "<a href='javascript:void(0)'  onclick=downloadFile(\""+record.id+"\")><i class='icon-doc'></i>&nbsp;&nbsp;&nbsp;"+value+"</a>";
            }else if(record.type==8){
                e.cellHtml = "<a href='javascript:void(0)'  onclick=openWin1(\""+record.id+"\",\""+record.name+"\")><i class='icon-screen-tablet'></i>&nbsp;&nbsp;&nbsp;"+value+"</a>";
            }else if(record.type==16){
                e.cellHtml = "<a href='javascript:void(0)'  onclick=openWin2(\""+record.id+"\",\""+record.name+"\")><i class='icon-docs'></i>&nbsp;&nbsp;&nbsp;"+value+"</a>";
            }

        }else if(field == "childrenNum"){
            e.cellHtml=value+"文件";
        }

    });
}]);
function openWin1(id,name){
    window.location.href="/suite/plugins/web/index.html#/knowledgeCenter/nodeInfo/"+id+"/"+name;
}
function openWin2(id,name){
    window.location.href="/suite/plugins/web/index.html#/knowledgeCenter/nodeInfoKc/"+id+"/"+name;
}
function openWin3(id,name){
    window.location.href="/suite/plugins/web/index.html#/knowledgeCenter/nodeInfoCm/"+id+"/"+name;
}

function downloadFile(id) {
    try{
        var elemIF = document.createElement("iframe");
        elemIF.src = "/suite/doc/"+id;
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    }catch(e){

    }
}
