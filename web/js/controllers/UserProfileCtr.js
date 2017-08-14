angular.module('MaterialApp')
    .controller('UserProfileCtr', ['$rootScope', '$scope', '$http', '$state', '$timeout',  function ($rootScope, $scope, $http, $state, $timeout) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
            Layout.setMainMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu
        });
        $scope.app.settings.layout.pageBodySolid = true;
        $scope.app.settings.layout.pageSidebarClosed = true;
        $scope.cyTaskData = $rootScope.cyTaskData;
        $scope.swTaskData = $rootScope.swTaskData;
        $scope.fwTaskData = $rootScope.fwTaskData;
        $scope.qtTaskData = $rootScope.qtTaskData;
        $scope.userInfo = $rootScope.userInfo;
        var notifications = query("getnotifications", {"startIndex": 1, "pageNum": 4, "isRead": 0})[0].notifications;
        var tasks = query("GM_Portal_Query_Tasks", {
            "type": "status",
            "status": "-1",
            "indexnum": 0,
            "pagenum": 10
        })[0].tasks;

        var processs = query("GM_Portal_Query_Process", {
            "type": "status",
            "status": "-1",
            "indexnum": 0,
            "pagenum": 10
        })[0].process;
        $scope.notifications = notifications;
        $scope.tasks = tasks;
        $scope.processs = processs;
        if ($scope.processs.length == 2) {
            $scope.process1 = $scope.processs[0];
            $scope.process2 = $scope.processs[1];
        } else if ($scope.processs.length == 1) {
            $scope.process1 = $scope.processs[0];
        }

        $scope.toProcessModelStart = function(processModelId) {
            var pm = query("GM_getprocessModelDetails",{processModelId:processModelId})[0];
            var PMDesc = eval('(' + pm.description + ')');
            //console.log(PMDesc);
            if (PMDesc.type == "self" || PMDesc.type == "other" ) {
                if (PMDesc.folderId == 16) {
                    $state.go('process.compRiskStart', {processModelId: processModelId, type: 'compliancerisk'});
                }
                if (PMDesc.folderId == 23) {
                    if(PMDesc.values=='assetapply') {
                        $state.go('process.assetApplyStart', { processModelId: processModelId, type: 'integrateManagement'});
                    }
                    else if(PMDesc.values=='assetbuy') {
                        $state.go('process.assetBuyStart', { processModelId: processModelId, type: 'integrateManagement'});
                    }
                    else {
                        $state.go('process.integrateManagementStart', { processModelId: processModelId, type: 'integrateManagement'});
                    }
                }
                if (PMDesc.folderId == 25) {
                    $state.go('process.systemRightStart', {processModelId: processModelId, type: 'systemright'});
                }
                if (PMDesc.folderId == 26) {
                    $state.go('process.operationStart', {processModelId: processModelId, type: 'operation'});
                }
                if (PMDesc.folderId == 18) {
                    $state.go('process.sealContractStart', {processModelId: processModelId, type: 'sealcontract'});
                }
            }
            else {
                $state.go('processmodelstart', { processModelId: processModelId });
            }
        };
    }]);