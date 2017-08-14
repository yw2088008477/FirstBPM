angular.module('MaterialApp').controller('GeneralPageController', ['$rootScope', '$scope', function($rootScope, $scope) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $scope.app.settings.layout.pageContentWhite = true;
        $scope.app.settings.layout.pageBodySolid = false;
        $scope.app.settings.layout.pageSidebarClosed = false;
    });
}]);
angular.module('MaterialApp').controller('newsSearchController', ['$scope', '$state', '$stateParams', '$rootScope', 'processDetailFactory', function($scope, $state, $stateParams, $rootScope, processDetailFactory) {

    $scope.reloadPage = function() {

        $state.reload();
    }

    // 删除新闻
    var userInfo = $rootScope.userInfo;
    var userName = userInfo.userName;
    $scope.userName = userName;
    $scope.adminFunc = $rootScope.adminFunc;
    $scope.deleteThread = function(threadId) {
        mini.confirm("确定删除记录？", "确定？",
            function(action) {
                if (action == "ok") {
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

    var forumId = $stateParams.forumId;
    $scope.forumId = forumId;
    // var forums = query("GM_getNewForums", {});
    // $scope.forums = forums;
    processDetailFactory.getNewForums();
    $scope.$on('getNewForumsUpdata', function(event, data) {
        $scope.forums = data.data;
    })

    var startIndex = 0;
    var bachSize = 12;
    var sortField = 3;
    var sort = 1;
    // var forumThreads = query("GM_getThreadsPaging", {
    //     forumId: forumId,
    //     startIndex: startIndex,
    //     bachSize: bachSize,
    //     sortNum: sortField,
    //     sort: sort,
    //     subject: "",
    //     flag: true
    // });

    processDetailFactory.getThreadsPaging(forumId, startIndex, bachSize, sortField, sort, "", true);
    $scope.$on('getThreadsPagingUpdata', function(event, data) {
        $scope.forumThreads = data.data;
        if (totalPage > 0) {
            for (var i = 1; i <= totalPage; i++) {
                var item = { page: i, startIndex: (i - 1) * 12, bachSize: 12, sortField: 3, sort: 1 };
                pageData.push(item);
            }
        } else {
            var item = { page: 1, startIndex: 0, bachSize: 12, sortField: 3, sort: 1 };
            pageData.push(item);
        }
    })
    var totalThread = getForumTotal($scope.forums, $scope.forumId);
    var totalPage = parseInt(totalThread / 12);
    var pageData = [];

    $scope.pageData = pageData;
    $scope.getSrc = function(attach) {
        var srcUrl = "";
        if (attach.length > 0) {
            for (var i = 0; i < attach.length; i++) {
                if (attach[i].attachmentImage == "yes") {
                    srcUrl = "/suite/doc/" + attach[i].attachmentId;
                }
            }
        }
        if (!srcUrl) {
            srcUrl = "/suite/plugins/metronic/theme/assets/pages/img/page_general_search/news.jpg";
        }
        return srcUrl;
    }

    $scope.searchThread = function(evt) {
        var subject = evt;
        // var newForumThreads = query("GM_getThreadsPaging", { forumId: $scope.forumId, startIndex: startIndex, bachSize: bachSize, sortNum: sortField, sort: sort, subject: subject, flag: false });
        // $scope.forumThreads = newForumThreads;
        processDetailFactory.getThreadsPaging($scope.forumId, startIndex, bachSize, sortField, sort, subject, false);
        $scope.$on('getThreadsPagingUpdata', function(event, data) {
            $scope.forumThreads = data.data;
            console.log($scope.forumThreads);
        })
    }

    $scope.change = function(x) {
        // var newForumThreads = query("GM_getThreadsPaging", { forumId: forumId, startIndex: startIndex, bachSize: bachSize, sortNum: x, sort: sort, subject: "", flag: false });
        // $scope.forumThreads = newForumThreads;
        processDetailFactory.getThreadsPaging(forumId, startIndex, bachSize, x, sort, "", false);
        $scope.$on('getThreadsPagingUpdata', function(event, data) {
            $scope.forumThreads = data.data;
        })
    }

    $scope.changeForum = function(x) {
        // var newForumThreads = query("GM_getThreadsPaging", { forumId: x, startIndex: startIndex, bachSize: bachSize, sortNum: sortField, sort: sort, subject: "", flag: false });
        // $scope.forumThreads = newForumThreads;

        processDetailFactory.getThreadsPaging(x, startIndex, bachSize, sortField, sort, "", false);
        $scope.$on('getThreadsPagingUpdata', function(event, data) {
            $scope.forumThreads = data.data;
            if (totalPage > 0) {
                for (var i = 1; i <= totalPage; i++) {
                    var item = { page: i, startIndex: (i - 1) * 12, bachSize: 12, sortField: 3, sort: 1 };
                    pageData.push(item);
                }
            } else {
                var item = { page: 1, startIndex: 0, bachSize: 12, sortField: 3, sort: 1 };
                pageData.push(item);
            }
        })
        $scope.forumId = x;
        totalPage = parseInt(getForumTotal($scope.forums, $scope.forumId) / 12);
        pageData = [];

        $scope.pageData = pageData;
    }

    $scope.updatePageSource = function(pageInfo) {
        // var newForumThreads = query("GM_getThreadsPaging", { forumId: forumId, startIndex: pageInfo.startIndex, bachSize: pageInfo.bachSize, sortNum: pageInfo.sortField, sort: pageInfo.sort, subject: "", flag: true });
        // $scope.forumThreads = newForumThreads;

        processDetailFactory.getThreadsPaging(forumId, pageInfo.startIndex, pageInfo.bachSize, pageInfo.sortField, pageInfo.sort, "", true);
        $scope.$on('getThreadsPagingUpdata', function(event, data) {
            $scope.forumThreads = data.data;
        })

    }

    $scope.lookDetails = function(threadId) {
        $state.go('nonfometNewsDetail', { threadId: threadId });
    };
    $scope.showToolTIp = function(newsFast) {
        var settings = {
                theme: "teal",
                sticky: false,
                horizontalEdge: "top",
                verticalEdge: "right"
            },
            $button = $(this);

        if (newsFast.subject) {
            settings.heading = newsFast.subject;
        }

        if (!settings.sticky) {
            settings.life = 10000;
        }

        $.notific8('zindex', 11500);
        $.notific8(newsFast.body, settings);

        $button.attr('disabled', 'disabled');

        setTimeout(function() {
            $button.removeAttr('disabled');
        }, 1000);

    }
}]);

function getForumTotal(forumIds, forumss) {
    for (var i = 0; i < forumss.length; i++) {
        if (forumss[i].forumId == forumIds) {
            return forumss[i].threadCount;
        }
    }
}
