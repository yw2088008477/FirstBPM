angular.module('MaterialApp').controller('UserProfileInfoCtr',['$rootScope','$scope', '$http', '$state', '$stateParams',function($rootScope, $scope, $http,$state,$stateParams) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
        Layout.setMainMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu
    });
    $scope.reloadPage=function(){
        $state.reload();
    }
    var userInfoData = query("GM_getLogInUserInfo",{userName:$stateParams.userName});
    var userInfo = {};
    if(userInfoData.length > 0) {
        userInfo = userInfoData[0];
    }
    $scope.userInfo = userInfo;
    $scope.firstName = userInfo.firstName == "" ? userInfo.userName : userInfo.firstName;
    $scope.customField1 = userInfo.customField1 == "" ? "超级管理员" : userInfo.customField1;

}]);
