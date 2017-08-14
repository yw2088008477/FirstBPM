$(document).ready(function () {
    var processmodetopfolderRs,processModelsRs,html;

    processmodetopfolderRs = query("getprocessmodelbyfolder");
    processModelsRs = query("getprocessmodetopfolder",{id:27});

    html = " <div id='js-filters-juicy-projects' class='cbp-l-filters-button'><div data-filter='*' class='cbp-filter-item-active cbp-filter-item'>所有流程<div class='cbp-filter-counter'></div></div>";
    for (var i = 0; i < processModelsRs.length; i++) {
        html+= "<div data-filter='." + processModelsRs[i].id + "'class='cbp-filter-item'>" + processModelsRs[i].name + "<div class='cbp-filter-counter'></div></div>";
    }
    html += "</div> <div id='js-grid-juicy-projects' class='cbp'>";
    for (var j = 0; j < processmodetopfolderRs.length; j++) {
        console.log(processmodetopfolderRs.length);
        var imgUrl = "";
        var folderId = 13;
        if (processmodetopfolderRs[j].icon == null) {
            imgUrl = "/suite/plugins/img/process/flowchart.png";
        } else {
            imgUrl = "/suite/plugins/servlet/loadsource/5/" + processmodetopfolderRs[j].icon;
        }
        if (processmodetopfolderRs[j].folderId != null) {
            folderId = processmodetopfolderRs[j].folderId;
        }
        html += "<div class='cbp-item " + folderId + "'><div class='cbp-caption'><div class='cbp-caption-defaultWrap'><img src='" + imgUrl + "' alt='' style='border-radius: 10px;'></div>" +
            "<div class='cbp-caption-activeWrap' style='border-radius: 10px;'><div class='cbp-l-caption-alignCenter'>" +
            "<div class='cbp-l-caption-body'><a ng-click='toProcessModelInfo(" + processmodetopfolderRs[j].id + ")' class='cbp-singlePage cbp-l-caption-buttonLeft' rel='nofollow'>查看详情</a>&nbsp;&nbsp;" +
            "<a ng-click='toProcessModelStart(" + JSON.stringify(processmodetopfolderRs[j]) + ")' class='cbp-singlePage cbp-l-caption-buttonRight'>发起流程</a></div></div></div></div>" +
            "<div class='cbp-l-grid-projects-title text-center'>" + processmodetopfolderRs[j].name + "</div></div>";
    }
    html+="</div> <div id='js-loadMore-juicy-projects' class='cbp-l-loadMore-button'> " +
        "<a href='../assets/global/plugins/cubeportfolio/ajax/loadMore.html'class='cbp-l-loadMore-link btn grey-mint btn-outline' rel='nofollow' ng-click='reloadPage()'> " +
        "<span class='cbp-l-loadMore-defaultText'>加载更多</span> <span class='cbp-l-loadMore-loadingText'>加载中...</span> <span class='cbp-l-loadMore-noMoreLoading'>没有更多了</span> </a> </div>"

    $('.grid').html(html);
});