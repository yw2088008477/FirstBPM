angular.module('MaterialApp')
    .controller('chartHightableCtr', ['$scope', '$stateParams', '$state', '$rootScope','$sce', function ($scope, $stateParams, $state, $rootScope,$sce) {
        $scope.reloadPage = function () {

            $state.reload();
        }
        var dyFunc = $rootScope.dyFunc;
        var fkFunc = $rootScope.fkFunc;
        var syFunc = $rootScope.syFunc;
        var gxFunc = $rootScope.gxFunc;
        var iframeSrc = "/suite/plugins/servlet/loadsource/1735/TabReport.html?dyFunc=" + dyFunc + "&fkFunc=" + fkFunc + "&syFunc=" + syFunc + "&gxFunc=" + gxFunc;
        $scope.trustSrc = $sce.trustAsResourceUrl(iframeSrc);

    }]);