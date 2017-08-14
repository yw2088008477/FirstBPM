angular.module('MaterialApp')
    .controller('processModelStartCtr', ['$scope', '$stateParams', '$state', '$rootScope','processDetailFactory', function ($scope, $stateParams, $state, $rootScope,processDetailFactory) {
        $scope.reloadPage = function () {

            $state.reload();
        }
        var processModelId = $stateParams.processModelId;
		var processUuid = $stateParams.processUuid;
		var processName = $stateParams.processName;
		$scope.processName=processName;
        $scope.src = "/suite/plugins/servlet/viewstartform?processModelUuid=" + processUuid;
    }]);