angular.module('MaterialApp')
    .controller('otherPlatformCtrl', ['$scope', '$stateParams', '$state','$sce', function ($scope, $stateParams, $state,$sce) {

        var platformId = $stateParams.platformId;
        var src = "http://10.11.0.135";
        var title = "";
        if (platformId == 0) {
            src += "/homepage/Homepage.jsp?hpid=2683&subCompanyId=13500&isfromportal=1&isfromhp=0";
            title = "行业资讯平台";
        } else if (platformId == 1) {
            src += "/homepage/Homepage.jsp?hpid=2722&subCompanyId=13500&isfromportal=1&isfromhp=0";
            title = "运营计划平台";
        }else if(platformId == 2){
            src += "/homepage/Homepage.jsp?hpid=2721&subCompanyId=13500&isfromportal=1&isfromhp=0";
            title = "运营绩效平台";
        }else if(platformId == 3){
            src += "/homepage/Homepage.jsp?hpid=2742&subCompanyId=13500&isfromportal=1&isfromhp=0";
            title = "运营改善平台";
        }else if(platformId == 4){
            src += "/homepage/Homepage.jsp?hpid=2542&subCompanyId=13500&isfromportal=1&isfromhp=0";
            title = "文件管理平台";
        }else {
            src = "https://mail.keyuanmed.com";
            title = "企业邮箱";
        }
        src += "&output=embed";
        $scope.src = $sce.trustAsResourceUrl(src)  ;
        $scope.title = title;
        $state.current.data.pageTitle = title;
    }]);

