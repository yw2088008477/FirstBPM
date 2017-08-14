angular.module('MaterialApp').controller('NotificationListCtrl', ['$scope', '$stateParams', '$state', '$uibModal', '$log', function ($scope, $stateParams, $state, $uibModal, $log) {

    $scope.filteredTodos = [];
    $scope.currentPage = 1;
    $scope.numPerPage = 10;
    $scope.maxSize = 10;
    $scope.searchText = "";
    $scope.deleteType = false;
    var rsnotifications;
    var totalCount = 0;


    var data = query("GM_getApplicationNotification");

    $scope.informs = data;
    $scope.changeColor = function (index) {
        if (index == 0) {
            return "badge badge-success";
        } else if (index == 1) {
            return "badge badge-primary";
        } else if (index == 2) {
            return "badge badge-warning";
        } else if (index == 3) {
            return "badge badge-info";
        } else if (index == 4) {
            return "badge badge-danger";
        } else if (index == 5) {
            return "badge badge-success";
        } else {
            return "badge badge-primary";
        }
    }

// 默认已阅未阅

    $scope.isReader = false;
    $scope.informId = 0;
    $scope.applicationType = "";
    var notifications = query("GM_getNotificationByAppname", {appname: $scope.informs[$scope.informId].appname});
    $scope.readedTypeTotal = $scope.informs[$scope.informId].totalReaded;
    $scope.unreadedTypeTotal = $scope.informs[$scope.informId].totalUnread;

    $scope.getIsReadNotifications = function (notifications, isRead) {
        var isReadNotifications = [];
        for (var i = 0; i < notifications.length; i++) {
            if (notifications[i].isRead == isRead) {
                isReadNotifications.push(notifications[i]);
            }
        }
        return isReadNotifications;
    }
    $scope.getApplicationTypeNotifications = function (inform, applicationType) {
        var applicationTypeNotifications = [];
        if (applicationType == "") {
            return query("GM_getNotificationByAppname", {appname: inform.appname});
        }
        for (var i = 0; i < inform.length; i++) {

            if (inform[i].applicationType.typeName == applicationType) {
                applicationTypeNotifications = applicationType.notification;
            }
        }
        return applicationTypeNotifications;
    }

    $scope.totalNotifications = $scope.getIsReadNotifications(notifications, $scope.isReader);
    $scope.applicationTypes = $scope.informs[$scope.informId].applicationType;


// 通知消息点击事件
    $scope.getApplicationType = function (informId, e) {
        $('#applicationType > li.active').removeClass('active');
        $(e.target).closest('li').addClass('active');
        $('#read > li.active').removeClass('active');
        $('#reader').addClass('active');
        var inform = $scope.informs[informId];
        $scope.readedTypeTotal = inform.totalReaded;
        $scope.unreadedTypeTotal = inform.totalUnread;
        //GM_getNotificationByAppname是通过appname获取相应模块未读的notification
        var notifications = query("GM_getNotificationByAppname", {appname: inform.appname});
        $scope.totalNotifications = $scope.getIsReadNotifications(notifications, false);
        $scope.isReader = false;
        $scope.informId = informId;
        $scope.applicationTypes = inform.applicationType;
        $scope.currentPage = 1;
        $scope.applicationType = "";
        $scope.searchText = "";


    }


// 类型栏点击事件

    $scope.getNotification = function (applicationType) {
        $('#read > li.active').removeClass('active');
        $('#reader').addClass('active');
        var notifications = applicationType.notification;
        $scope.totalNotifications = $scope.getIsReadNotifications(notifications, false);
        $scope.readedTypeTotal = applicationType.readedTypeTotal;
        $scope.unreadedTypeTotal = applicationType.unreadedTypeTotal;
        $scope.isReader = false;
        $scope.currentPage = 1;
        $scope.applicationType = applicationType.typeName;
        $scope.searchText = "";


    }


// 过滤已阅未阅
    $scope.whetherRead = function (item, e) {
        var notifications = $scope.getApplicationTypeNotifications($scope.informs[$scope.informId], $scope.applicationType);
        $scope.totalNotifications = $scope.getIsReadNotifications(notifications, item);
        $scope.isReader = item;
        $scope.currentPage = 1;
        $('#read > li.active').removeClass('active');
        $(e.target).closest('li').addClass('active');
        $scope.searchText = "";


    }


    $scope.getPageNotifications = function (pageSize, notifications) {
        var page = 0;
        if (notifications.length < pageSize * 10) {
            page = notifications.length;
        } else {
            page = pageSize * 10;
        }
        var pageNotifications = [];
        for (var i = (pageSize - 1) * 10; i < page; i++) {
            pageNotifications.push(notifications[i]);
        }
        return pageNotifications;
    }

    $scope.getSearchNotifications = function (notifications, text) {
        var searchNotifications = [];
        for (var i = 0; i < notifications.length; i++) {
            if (notifications[i].message.indexOf(text) != -1 || notifications[i].subject.indexOf(text) != -1) {
                searchNotifications.push(notifications[i]);
            }
        }
        return searchNotifications;
    };
//分页
    $scope.$watch("currentPage + numPerPage + isReader + informId + applicationType + searchText + deleteType", function () {
        if ($scope.totalNotifications.length == 0) {
            $("#noNotification").show();
        } else {
            $("#noNotification").hide();
        }
        totalCount = ($scope.totalNotifications.length / 10) * 10;
        $scope.makeTodos();
        var begin = (($scope.currentPage - 1) * $scope.numPerPage),
            end = begin + $scope.numPerPage;
        $scope.filteredTodos = $scope.todos.slice(begin, end);
        $scope.notifications = $scope.getPageNotifications($scope.currentPage, $scope.totalNotifications);
        if ($scope.searchText) {
            $scope.notifications = $scope.getSearchNotifications($scope.notifications, $scope.searchText);
        }
    });
    $scope.makeTodos = function () {
        $scope.todos = [];
        for (i = 1; i <= totalCount; i++) {
            $scope.todos.push({text: "todo " + i, done: false});
        }
    };
    //分页结束
    $scope.readNotification = function (id) {
        var state = execute("GM_readNotifications", {id: id});
        return state;

    }
    $scope.gotoNotificationDetail = function (notification) {
        var id = notification.id;
        var attribute = notification.attribute;

        if ($scope.readNotification(id)) {
            var appname = $scope.informs[$scope.informId].appname;
            if (appname == "Discussion Topics") {
                $state.go("titleMessageDetail", {attribute: attribute});
            } else if (appname == "Personalization") {
                $state.go("personalizedMessageDetail", {attribute: attribute});
            } else if (appname == "Portal") {
                $state.go("portalMessageDetail", {attribute: attribute});
            } else if (appname == "Collaboration") {
                $state.go("cooperationMessageDetail", {attribute: attribute});
            } else if (appname == "Process") {
                $state.go("notificationDetailId", {attribute: attribute});
            } else if (appname == "Tempo") {
                $state.go("sendMessageDetail", {attribute: attribute});
            } else {
                $state.go("taskMessageDetail", {attribute: attribute});
            }
        }

    };


    $scope.deleteNotifications = function () {

        var title = $scope.isReader ? "确定要删除本页吗?" : "确定要将本页全部数据标记为已阅吗?"

        if (confirm(title)) {
            $scope.deleteNotificationFun("");

        }
        //mini.confirm("确定要删除吗?", "确定", function (action) {
        //    if (action == "ok") {
        //        $scope.$apply($scope.deleteNotificationFun(""));
        //    }
        //});
    }

    $scope.deleteNotification = function (notification) {
        //mini.confirm("确定要删除吗?", "确定", function (action) {
        //    if (action == "ok") {
        //        ($scope.deleteNotificationFun(notification)
        //
        //    }
        //});


        if (confirm("确定要删除吗?")) {
            $scope.deleteNotificationFun(notification);

        }
    }


    $scope.deleteNotificationFun = function (notification) {
        var state = "";
        if (!notification) {
            var id = [];
            for (var i = 0; i < $scope.notifications.length; i++) {
                id.push($scope.notifications[i].id);
            }
            if ($scope.isReader) {
                state = execute("GM_deleteNotifications", {id: id.join(",")});

            } else {
                state = $scope.readNotification(id.join(","));
            }
        } else {

            if ($scope.isReader) {
                state = execute("GM_deleteNotifications", {id: notification.id});

            } else {
                state = $scope.readNotification(notification.id);
            }
        }

        if (state == "true") {

            var title = $scope.isReader ? "删除成功!" : "标记成功!";

            alert(title);
            if (!notification) {
                var index = ($scope.currentPage - 1) * 10;
                var count = $scope.notifications.length;
                $scope.totalNotifications.splice(index, count);
                $scope.deleteType = !$scope.deleteType;

                if ($scope.currentPage > 1) {
                    $scope.currentPage = $scope.currentPage - 1;
                }
            } else {
                $scope.totalNotifications.remove(notification);
                $scope.deleteType = !$scope.deleteType;
            }
            $scope.informs = query("GM_getApplicationNotification");
            var inform = $scope.informs[$scope.informId];
            $scope.applicationTypes = $scope.informs[$scope.informId].applicationType;

            $scope.readedTypeTotal = inform.totalReaded;
            $scope.unreadedTypeTotal = inform.totalUnread;


        } else {
            var title = $scope.isReader ? "删除失败!" : "标记失败!";

            alert(title);
        }
    };
}
]);
















