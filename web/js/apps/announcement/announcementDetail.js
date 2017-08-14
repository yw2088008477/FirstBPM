
angular.module('MaterialApp')
    .controller('announcementDetailController', ['$scope', '$state', '$stateParams', '$rootScope','processDetailFactory','baseServices',function ($scope, $state, $stateParams, $rootScope,processDetailFactory,baseServices) {
        $scope.threadSummry = {};
        var userInfo = $rootScope.userInfo;
        var threadId = $stateParams.threadId;
        var data = {threadId: threadId, subject: "阅读", messageBody: "阅读"};

        processDetailFactory.getNewsFastTopicSummry(threadId);
        $scope.$on("newsFastTopicSummryUpdata",function (event,req) {
           $scope.threadSummry=req.data[0];
            processDetailFactory.getUsersInfo($scope.threadSummry.readPeo.join("!"));
            $scope.$on("usersInfoUpdata",function (event,req) {
                $scope.dataReads=req.data;
            });
             $scope.dataUnreads = [];
           processDetailFactory.getAcconmentReadPeo($scope.threadSummry.rootMessageBody.split("!!")[1],$scope.threadSummry.readPeo.join("!"));
            $scope.$on("acconmentReadPeoUpdata",function (event,req) {
                if($scope.dataUnreads!=0){
                    $scope.dataUnreads = req.data;
                }
            })

            //点击人名跳转到相应个人信息页面
            var openUserInofUrl = "";
            if ($scope.threadSummry.creator == userInfo.userName) {
                openUserInofUrl = "/suite/plugins/web/index.html#/profile/dashboard";

            } else {
                openUserInofUrl = "/suite/plugins/web/index.html#/userProfile/" + $scope.threadSummry.creator;

            }
            $scope.openUserInofUrl = openUserInofUrl;
        })


        $scope.getIframSrc = function (attach) {
            var srcUrl1 = "";
            if(attach!=null) {
                if (attach.length > 0) {
                    for (var i = 0; i < attach.length; i++) {
                        if (attach[i].suffix == "html") {
                            return "/suite/plugins/servlet/loadsource/3767/" + attach[i].fileName + ".html";
                        }
                    }
                }
            }
            return srcUrl1;
        };
        $scope.goToUserInfo = function (userName) {
            if (userInfo.userName != userName) {
                $state.go('userProfile', {userName: userName});
            } else {
                $state.go('profile.dashboard');
            }

        };

        $scope.lookDetails = function (forumId) {
            $state.go('accounmentAll', {forumId: forumId});
        };
        $scope.startProcessNewssss = function (uuid, data) {
            data["uuid"] = uuid;
            baseServices.postPromise('SetProcessActiveVariable',data).then(function (req) {
                console.log(req);
            }, function () {
                bootbox.alert({message: '评论发送失败,请联系管理员！', size: 'small'});
            });
        };
        $scope.submitMessage = function (thread) {
            var messageBody = $("#messageBody").val();
            var data = {threadId: thread, subject: "评论", messageBody: messageBody};
            $scope.startProcessNewssss("0003ddce-2e3c-8000-9e06-010000010000", {formData: mini.encode(data)});
            $timeout(function () {
                processDetailFactory.getNewsFastTopicSummry(threadId);
                $scope.$on("newsFastTopicSummryUpdata",function (event,req) {
                    $scope.threadSummry=req.data;
                })
            }, 3000)

        }

        $scope.myFilter = function (item) {
            return item.messageBody != "阅读";
        };

        $scope.myFilterAttach = function (item) {
            return item.attachmentImage != "yes";
        };

        $scope.updateThread = function (threadId) {
            processDetailFactory.getNewsFastTopicSummry(threadId);
            $scope.$on("newsFastTopicSummryUpdata",function (event,req) {
                $scope.threadSummry=req.data;

            })

        };
        $scope.startProcessMessage = function (uuid, data) {
            data["uuid"] = uuid;
            baseServices.postPromise('SetProcessActiveVariable',data).then(function (req) {
                console.log(req);
            }, function () {
                bootbox.alert({message: '流程提交失败,请联系管理员！', size: 'small'});
            });
        };
        $scope.startProcessMessage("0003ddce-2e3c-8000-9e06-010000010000", {formData: mini.encode(data)});
    }
    ]);

$("#mainFrame").load(function () {
    var mainheight = $(this).contents().find("body").height() + 500;
    $(this).height(mainheight);
});