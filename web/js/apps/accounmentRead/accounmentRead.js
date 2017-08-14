var forumId = "";
angular.module('MaterialApp')
    .controller('accounmentAllController', ['$scope', '$state', '$rootScope', '$stateParams', 'processDetailFactory', function ($scope, $state, $rootScope, $stateParams,processDetailFactory) {
        // set sidebar closed and body solid layout mode
        $scope.app.settings.layout.pageContentWhite = true;
        $scope.app.settings.layout.pageBodySolid = true;
        $scope.app.settings.layout.pageSidebarClosed = true;
        $scope.adminFunc = $rootScope.adminFunc;


        $scope.userInfo = $rootScope.userInfo;
        // 把内容为空的附件去掉后的附件长度
        $scope.getAttachmentLength = function (e) {
            var newAttachments = [];
            if(e.attachments!=null){
            for (var i = 0; i < e.attachments.length; i++) {
                if (e.attachments[i].attachmentId != "null" && e.attachments[i].fileName.indexOf('公告附件(') < 0) {
                    newAttachments.push(e.attachments[i]);
                }
            }
            }
            return newAttachments.length;

        }


        if ($scope.adminFunc) {
            $scope.showAdd = true;
        } else {
            $scope.showAdd = true;
         /*   var isAdmin = execute("GM_hasAdminFunction", {id: 193});
            if (isAdmin == "false") {
                $scope.showAdd = false;
            } else {
                $scope.showAdd = true;
            }*/

        }


        forumId = $stateParams.forumId;
        /*var forums = query("GM_getForumNews");
          $scope.forums = forums;*/
        processDetailFactory.getForumNews();
        $scope.$on("forumNewsUpdata",function (event,data) {
            $scope.forums=data.data;
        })




        $scope.loadPageBy = function () {
            //$("#inboxHeader").hide();
            //$('.inbox-header > h1').text("新建传阅");
            $('.inbox-nav > li.active').removeClass('active');
            $state.go('accounmentRead.accounmentStart');
        }

        $scope.loadPageFr = function (id, e, obj) {
            //$("#inboxHeader").hide();
            $('.inbox-nav > li.active').removeClass('active');
            $(e.target).closest('li').addClass('active');
            //$('.inbox-header > h1').text(obj);
            $state.go('accounmentRead.accounmentInbox', {forumId: id, forumName: obj});
        }

        $scope.loadPageFt = function (id, e, obj) {
            //$("#inboxHeader").hide();
            $('.inbox-nav > li.active').removeClass('active');
            $(e.target).closest('li').addClass('active');
            //$('.inbox-header > h1').text(obj);
            $state.go('accounmentRead.accounmentRecord', {statuId: id});
        }
        $scope.reloadPage = function () {

            $state.reload();
        }


    }]);