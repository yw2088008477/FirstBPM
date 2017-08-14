angular.module('MaterialApp').controller('PageCtrl', ['$scope','$state','$rootScope','$stateParams','$uibModal', function($scope,$state,$rootScope,$stateParams,$uibModal) {
    $scope.page = eval("["+execute("getpageinfo",{id:$stateParams.page})+"]")[0];
    $scope.loadReportIframe=function(portletId,reportId){
        var iframeObj = $("#"+portletId+reportId);
        if(iframeObj.attr("id")!=null){
            if(iframeObj.attr("src")==null){
                var height = Number(iframeObj.attr("height"));
                if(height==270){
                    height=75;
                }
                iframeObj.height($(window).height()+$(window).height()*0.2-152);
                iframeObj.attr("src","/suite/plugins/servlet/ViewReport?reportId="+reportId);
            }
        }
    }
    $scope.loadPortlet=function(frame){
        if(frame=="portlet.titleonly"){
            return "panel panel-default";
        }else if(frame=="portlet.default"){
            return "panel panel-info";
        }else if(frame=="portlet.titleframe"){
            return "panel panel-success";
        }else if(frame=="portlet.plain"){
            return "panel panel-default";
        }
    }
}]);
