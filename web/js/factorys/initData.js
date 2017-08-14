/**
 * Created by wankang on 2017/1/6.
 */
angular.module('MaterialApp')
    /*公用的service*/
    .factory('baseServices', ['$rootScope', '$http', '$q', function($rootScope, $http, $q) {
        var service = {};
       /*$http get 请求方法*/
        service.getPromise = function(funcName, data) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: "/suite/plugins/servlet/" + funcName,
                params: data
            }).success(function(req) {
                deferred.resolve(req);
            }).error(function(err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }
        /*$http post 请求方法*/
        service.postPromise = function(funcName, data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: "/suite/plugins/servlet/" + funcName,
                data: data,
                responseType:'json',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                    return str.join("&");
                }
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        /*$http get 请求方法 ，后面跟着执行规则参数*/
        service.getPromiseExe = function(url, data) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: "/suite/plugins/servlet/execute/" + url,
                params: data
            }).success(function(req) {
                deferred.resolve(req);
            }).error(function(err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }
        /*$http post 请求方法 ，后面跟着执行规则参数*/
        service.postPromiseExe = function(url, data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: "/suite/plugins/servlet/execute/" + url,
                data: data,
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                    return str.join("&");
                }
            }).success(function(req) {
                deferred.resolve(req);
            }).error(function(err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        /*$http get 请求方法 ，后面跟着执行规则参数*/
        service.get = function(url) {
            return $http.get("/suite/plugins/servlet/query/" + url);
        }

        /*$http post 请求方法 ，后面跟着执行规则参数*/
        service.post = function(url) {
            return $http.post("/suite/plugins/servlet/query/" + url);

        }
        service.getExecute = function(url, data) {
            return $http.get("/suite/plugins/servlet/execute/" + url, data);
        }
        service.postEexcute = function(url, data) {
            return $http.post("/suite/plugins/servlet/execute/" + url, data);
        }
        service.basePost = function (url) {
            return $http.post(url,{});
        }
        return service;
    }])
    .factory('processDetailFactory', ['$rootScope', 'baseServices', function($rootScope, baseServices) {
        var service = {};

        /*根据流程模型Id得到流程模型信息，通过广播方式传递变更信息*/
        service.getProcessModelDetails = function(id) {
            baseServices.post("GM_getprocessModelDetails?processModelId=" + id).then(function(res) {
                $rootScope.$broadcast('processModelDetailserviceUpdata', res);
            })
        };

        /*根据type类型判断决定是否返回的是回看信息*/
        service.getActiveVariables = function(id, type) {
            if (type == 'process') {
                baseServices.post("getprocessvariables?id=" + id).then(function(res) {
                    $rootScope.$broadcast("activeVariableUpdata", res);
                })
            } else {
                baseServices.post("gettaskactivevariable?taskId=" + id).then(function(res) {
                    $rootScope.$broadcast("activeVariableUpdata", res);
                })
            }
        };

        /*根据流程id得到流程信息，通过广播方式传递变更信息*/
        service.getProcessDetails = function(id) {
            baseServices.post("GM_getprocessDetails?processId=" + id).then(function(res) {
                $rootScope.$broadcast('processDetailserviceUpdata', res);
            })
        };

        /*根据taskid得到task详细信息，通过广播方式传递变更信息*/
        service.gettaskDetails = function(id) {
            baseServices.post("GM_gettaskdetails?taskId=" + id).then(function(res) {
                $rootScope.$broadcast('taskDetailserviceUpdata', res);
            })
        };

        /*根据流程id得到泳道信息，通过广播方式传递变更信息*/
        service.getProcessWizardData = function(id) {
            baseServices.post("GM_getprocesswizarddata?processId=" + id).then(function(res) {
                $rootScope.$broadcast('wizardserviceUpdata', res);
            })
        };

        /*根据流程id得到意见信息，通过广播方式传递变更信息*/
        service.getProcessnotes = function(id) {
            baseServices.post("GM_getProcessNotesddd?processId=" + id).then(function(res) {
                $rootScope.$broadcast("notesServiceUpdata", res);
            })
        }



        service.getprocessvariables = function(id) {
            baseServices.post("GM_getProcessVariables?processId=" + id).then(function(res) {
                $rootScope.$broadcast("processvariablesUpdata", res);
            })
        }

        /*查询当前登录用户信息，通过广播方式传递变更信息*/
        service.getloginUserInfo = function() {
            baseServices.post("GM_getloginUserInfo").then(function(res) {
                $rootScope.$broadcast("loginuserInfoUpdata", res);
            })
        }


        service.getForumNews = function() {
            baseServices.post("GM_getForumNews").then(function(res) {
                $rootScope.$broadcast("forumNewsUpdata", res);
            })
        }
        service.getNewsFastTopicSummry = function(id) {
            baseServices.post("GM_getNewsFastTopicSummry?threadId=" + id).then(function(res) {
                $rootScope.$broadcast("newsFastTopicSummryUpdata", res);
            })
        }
        service.getNewsFastTopic = function() {
            baseServices.post("GM_getNewsFastTopic").then(function(res) {
                $rootScope.$broadcast("newsFastTopicUpdata", res);
            })
        }
        service.getDeleteThreadById = function(id) {
            baseServices.post("GM_deleteThreadById?threadId=" + id).then(function(res) {
                $rootScope.$broadcast("deleteThreadByIdUpdata", res);
            })
        }
        service.getUsersInfo = function(id) {
            baseServices.post("GM_getUsersInfo?userId=" + id).then(function(res) {
                $rootScope.$broadcast("usersInfoUpdata", res);
            })
        }
        service.getAcconmentReadPeo = function(processId, readUsersId) {
            baseServices.post("GM_getAcconmentReadPeo?processId=" + processId + "&readUsersId=" + readUsersId).then(function(res) {
                $rootScope.$broadcast("acconmentReadPeoUpdata", res);
            })
        }
        service.getNewForums = function() {
            baseServices.post("GM_getNewForums").then(function(res) {
                $rootScope.$broadcast("getNewForumsUpdata", res);
            })
        }
        service.getNewsFastTopicSummry = function(id) {
            baseServices.post("GM_getNewsFastTopicSummry?threadId=" + id).then(function(res) {
                $rootScope.$broadcast("newsFastTopicSummryUpdata", res);
            })
        }
        service.getThreadsPaging = function(forumId,startIndex,bachSize,sortNum,sort,subject,flag) {
            baseServices.post("GM_getThreadsPaging?forumId="+forumId+"&startIndex="+startIndex+"&bachSize="+bachSize+"&sortNum="+sortNum+"&sort="+sort+"&subject="+subject+"&flag="+flag).then(function(res) {
                $rootScope.$broadcast("getThreadsPagingUpdata", res);
            })
        }
        service.getReadUserName = function(read, unread) {
            return $rootScope.query("GM_getReadUserName", { readedPeo: read, unreadPeo: unread })[0];
        }

        // 所有页面$rootscope请求数据
        service.getnotificationscount = function () {
            baseServices.post("getnotificationscount").then(function (res) {
                $rootScope.$broadcast('notificationscountUpdata', res);
            })
        };
        service.getProcessPortalCount = function () {
            baseServices.post("GM_getProcessPortalCount").then(function (res) {
                $rootScope.$broadcast('ProcessPortalCountUpdata', res);
            })
        };
        service.getapplications = function () {
            baseServices.post("getapplications").then(function (res) {
                $rootScope.$broadcast('applicationsUpdata', res);
            })
        };
        service.getLogInUserFunction = function () {
            baseServices.post("GM_GetLogInUserFunction").then(function (res) {
                $rootScope.$broadcast("logInUserFunctionUpdata", res);
            })
        }
        service.getTaskCountByPmModel = function (id) {
            baseServices.post("GM_GetTaskCountByPmModel").then(function (res) {
                $rootScope.$broadcast("taskCountByPmModelUpdata", res);
            })
        }
        return service;
    }])
    .factory('notificationFactory',['$rootScope','baseServices',function($rootScope, baseServices){
        var service = {};
        service.getApplicationNotifications = function () {
            baseServices.postPromise('query/GM_getApplicationNotification',{}).then(function (res) {
                $rootScope.$broadcast('ApplicationNotificationUpdate', res);
            })
        }

        service.getNotificationByAppName  = function(appname) {
            baseServices.postPromise('query/GM_getNotificationByAppname',{appname:appname}).then(function (res) {
                $rootScope.$broadcast('NotificationByAppNameUpdate', res);
            })
        }

        service.readNotification = function (id) {
            baseServices.postPromise('execute/GM_readNotifications',{id:id}).then(function (res) {
                $rootScope.$broadcast('ReadNotificationsUpdate', res);
            })
        }

        service.DeleteNotification = function (id) {
            baseServices.postPromise('execute/GM_deleteNotifications',{id:id}).then(function (res) {
                $rootScope.$broadcast('DeleteNotificationsUpdate', res);
            })
        }
        return service;
    }]);