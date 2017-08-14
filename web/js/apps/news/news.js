angular.module('MaterialApp')
    .controller('newsController', ['$scope', '$state', function($scope, $state) {
        $scope.reloadPage = function() {
            $state.reload();
        }
    }]);

angular.module('MaterialApp')
    .controller('newsController', ['$scope', '$state', '$rootScope', 'processDetailFactory', function($scope, $state, $rootScope, processDetailFactory) {
        var userInfo = $rootScope.userInfo;
        var userName = userInfo.userName;
        $scope.userName = userName;
        /* var isAdmin=execute("GM_hasAdminFunction",{id:193});
         if(isAdmin=="false"){
             $scope.showAdd=false;
         }else{
             $scope.showAdd=true;
         }*/
        $scope.adminFunc = $rootScope.adminFunc;
        $scope.reloadPage = function() {

            $state.reload();
        }
        $scope.deleteThread = function(threadId) {
            mini.confirm("确定删除记录？", "确定？",
                function(action) {
                    if (action == "ok") {
                        // var deFlag = execute("GM_deleteThreadById", { threadId: threadId });

                        processDetailFactory.getDeleteThreadById(threadId);
                        $scope.$on('deleteThreadByIdUpdata', function(event, data) {
                            $scope.deFlag = data.data;
                            if ($scope.deFlag == "true") {
                                $state.reload();
                            } else {

                            }
                        })


                    } else {

                    }
                }
            );
        }

        processDetailFactory.getNewsFastTopic();
        $scope.$on('newsFastTopicUpdata', function(event, data) {
            $scope.newsFasts = data.data;
        })

        //alert(mini.encode(newsFasts));
        // $scope.newsFasts=newsFasts;
        $scope.getSrc = function(attach) {
            var srcUrl = "";
            if (attach.length > 0) {
                for (var i = 0; i < attach.length; i++) {
                    if (attach[i].attachmentImage == "yes") {
                        return "/suite/doc/" + attach[i].attachmentId;
                    }
                }
            }
            if (!srcUrl) {
                srcUrl = "/suite/plugins/metronic/theme/assets/pages/img/page_general_search/2.jpg";
            }
            return srcUrl;
        }
        $scope.lookDetails = function(threadId) {
            $state.go('nonfometNewsDetail', { threadId: threadId });
        };


        // 把内容为空的附件去掉后的附件长度
        $scope.getAttachmentLength = function(topic) {
            var newAttachments = [];
            for (var i = 0; i < topic.attachments.length; i++) {
                if (topic.attachments[i].attachmentId != "null") {
                    newAttachments.push(topic.attachments[i]);
                }
            }
            return newAttachments.length;
        }



    }]);
