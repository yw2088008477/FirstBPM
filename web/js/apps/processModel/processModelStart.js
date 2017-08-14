angular.module('MaterialApp')
    .controller('processModelStartCtr', ['$scope', '$stateParams', '$state', '$rootScope','processDetailFactory', function($scope, $stateParams, $state, $rootScope,processDetailFactory) {
        $scope.reloadPage = function() {

            $state.reload();
        }
        var processModelId = $stateParams.processModelId;
        // var pm = query("GM_getprocessModelDetails", { processModelId: processModelId })[0];
        // $scope.pm = pm;

        processDetailFactory.getProcessModelDetails(processModelId);
        $scope.$on('processModelDetailserviceUpdata', function(event, data) {
            $scope.pm = data.data;
            $scope.src = "/suite/plugins/servlet/viewstartform?processModelUuid=" + $scope.pm.uuid;
        })
        
    }]);
$("#processModelContent").on("load", function() {
    var mainheight = $(this).contents().find("body").height() + 400;
    $(this).height(mainheight);
});
