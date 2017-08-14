angular.module('MaterialApp').controller('ProcessModelCtrl', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {

    // set sidebar closed and body solid layout mode
    $scope.app.settings.layout.pageContentWhite = true;
    $scope.app.settings.layout.pageBodySolid = false;
    $scope.app.settings.layout.pageSidebarClosed = false;
    $scope.reloadPage = function () {

        $state.reload();
        //window.location.reload();
    }

    $scope.toProcessModelInfo = function (producerId) {
        $state.go('processmodelinfo', { processModelId: producerId });
    };
    $scope.toProcessModelStart = function (process) {
        if (process.type == "self" || process.type == "other") {
            if (process.folderId == 16)
                $state.go('process.compRiskStart', {processModelId: process.id, type: 'compliancerisk'});
            if (process.folderId == 23) {
                if (process.values == 'assetapply') {
                    $state.go('process.assetApplyStart', {processModelId: process.id, type: 'integrateManagement'});
                }
                else if (process.values == 'assetbuy') {
                    $state.go('process.assetBuyStart', {processModelId: process.id, type: 'integrateManagement'});
                }
                else {
                    $state.go('process.integrateManagementStart', {
                        processModelId: process.id,
                        type: 'integrateManagement'
                    });
                }
            }
            if (process.folderId == 25)
                $state.go('process.systemRightStart', {processModelId: process.id, type: 'systemright'});
            if (process.folderId == 26)
                $state.go('process.operationStart', {processModelId: process.id, type: 'operation'});
            if (process.folderId == 18)
                $state.go('process.sealContractStart', {processModelId: process.id, type: 'sealcontract'});
        } else {
            $state.go('processmodelstart', {processModelId: process.id});
        }
    };

    $scope.load = function () {

    }

    $scope.load();

    $scope.getFilterr = function (data) {
        return "." + data;
    }

}]);
angular.module('MaterialApp').directive('cubeportfolio', function(){
    return {
        restrict: 'EA',
        transclude: true,
        scope: { data: '=',},
        template: '<div class="cbp-item {{ s.folderId }}" ng-repeat="s in data"><div class="cbp-caption"><div class="cbp-caption-defaultWrap"><img src=" + {{ s.icon?\'/suite/plugins/img/process/flowchart.png\':\'/suite/plugins/img/process/flowchart.png\' }} + " alt=""  style="border-radius: 10px;"></div>'+
        '<div class="cbp-caption-activeWrap" style="border-radius: 10px;"><div class="cbp-l-caption-alignCenter"><div class="cbp-l-caption-body"><a href="javascript:void(0);" data-ng-click="toProcessModelStart({{s.id}})" class="cbp-singlePage cbp-l-caption-buttonLeft" rel="nofollow">查看详情</a>&nbsp;&nbsp;'+
        '<a href="javascript:void(0);" data-ng-click="toProcessModelStart(JSON.stringify({{s}}))" class="cbp-singlePage cbp-l-caption-buttonRight">发起流程</a></div></div></div></div><div class="cbp-l-grid-projects-title text-center">{{s.name}}</div></div>',
        link : function(scope, element, attrs) {
            element.cubeportfolio(scope.$eval(attrs.data));
        }
    };
});