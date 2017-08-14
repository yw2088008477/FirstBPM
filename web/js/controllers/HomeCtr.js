angular.module('MaterialApp')
    .controller('HomeCtr', ['$rootScope', '$scope', '$stateParams', '$state', '$log', 
        function ($rootScope, $scope, $stateParams, $state, $log) {
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            // set sidebar closed and body solid layout mode
            $scope.app.settings.layout.pageContentWhite = true;
            $scope.app.settings.layout.pageBodySolid = false;
            $scope.app.settings.layout.pageSidebarClosed = false;
            $scope.getnotificationscount = $rootScope.getnotificationscount;
            $scope.cyProcessData = $rootScope.cyProcessData;
            $scope.swProcessData = $rootScope.swProcessData;
            $scope.fwProcessData = $rootScope.fwProcessData;
            $scope.qtProcessData = $rootScope.qtProcessData;
            $scope.applications = $rootScope.applications;
            $scope.homeFunc = $rootScope.homeFunc;
            $scope.userInfo = $rootScope.userInfo;
            $scope.cyTaskData = $rootScope.cyTaskData;
            $scope.swTaskData = $rootScope.swTaskData;
            $scope.fwTaskData = $rootScope.fwTaskData;
            $scope.qtTaskData = $rootScope.qtTaskData;
            var newForums = query("GM_getNewsFastTopic");
            var newsFasts = query("GM_getSubscribeThreadAll");

            // add myself
            // 产品定价的数据筛选
            var newPrices = query("GM_getSubscribeThread");
            var sss = [];
            for (var i = 0; i < newPrices.length; i++) {
                if (newPrices[i].forumName == "公司产品定价") {
                    sss.push(newPrices[i]);
                }
            }
            if (sss.length > 0) {
                $scope.newThreadInfos = sss[0].threadInfo;

            }

            // console.log(newPrices);
            // console.log(sss[0]);


            if ($scope.taskCount == null) {
                $scope.taskCount = {statusall: 0, status2: 0};
            }
            if ($scope.processCount == null) {
                $scope.processCount = {statusall: 0};
            }


            var newForums = newForums;
            var newNews = [];
            var newPans = [];
            var newSys = [];
            var newComs = [];
            var newDxs = [];
            if (newForums.length > 0) {
                for (var i = 0; i < newForums.length; i++) {
                    if (newForums[i].forum.forumName == "韶冶工作简报") {
                        newSys.push(newForums[i]);
                    } else if (newForums[i].forum.forumName == "盘龙动态") {
                        newPans.push(newForums[i]);
                    } else if (newForums[i].forum.forumName == "新闻资讯") {
                        newNews.push(newForums[i]);
                    } else if (newForums[i].forum.forumName == "企业党建") {
                        newComs.push(newForums[i]);
                    } else if (newForums[i].forum.forumName == "丹霞动态") {
                        newDxs.push(newForums[i]);
                    }

                }

            }

            $scope.reloadPage = function () {

                $state.reload();
            }


            // 把内容为空的附件去掉后的附件长度
            $scope.getAttachmentLength = function (e) {
                var newAttachments = [];
                for (var i = 0; i < e.attachments.length; i++) {
                    if (e.attachments[i].attachmentId != "null") {
                        newAttachments.push(e.attachments[i]);
                    }
                }
                return newAttachments.length;
            }


            var newsFasts = newsFasts;
            $scope.lookDetails11 = function (threadId) {
                $state.go('nonfometAnnouncementDetail', {threadId: threadId});
            };


            $scope.newsFastss = newsFasts;
            $scope.newNews = newNews;
            $scope.newPans = newPans;
            $scope.newSys = newSys;
            $scope.newComs = newComs;
            $scope.newDxs = newDxs;
            //$scope.processs = query("GM_Portal_Query_Process",{"type":"status","status":"-1","indexnum":0,"pagenum":10})[0].process;
            // console.log(newNews[0].topics);

            $scope.getSrc = function (attach) {
                var srcUrl = "";
                if (!attach) {
                    return "/suite/plugins/metronic/theme/assets/pages/img/page_general_search/2.jpg";
                }
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

            $scope.lookDetails = function (threadId) {
                $state.go('nonfometNewsDetail', {threadId: threadId});
            };
            $scope.labelClass = function (label) {
                return {
                    'arrow-info': angular.lowercase(label) === 1,
                    'arrow-warning': angular.lowercase(label) === 0,
                    'arrow-success': angular.lowercase(label) === 2
                };
            };
            $scope.bgClass = function (label) {
                return {
                    'bg-info': angular.lowercase(label) === 1,
                    'bg-warning': angular.lowercase(label) === 0,
                    'bg-success': angular.lowercase(label) === 2
                };
            };
        }]);














