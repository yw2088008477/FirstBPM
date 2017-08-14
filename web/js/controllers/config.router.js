/**
 * Created by wankang on 2017/1/5.
 */
angular.module('MaterialApp')
    .run(
        [
            "$rootScope", "$state",
            function ($rootScope, $state) {
                $rootScope.$state = $state;
            }
        ]
    )
    .config([
        '$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            // Redirect any unmatched url
            $urlRouterProvider.otherwise("/home");

            $stateProvider
                .state('home', {
                    url: "/home",
                    templateUrl: "tpl/home.html",
                    data: {pageTitle: '北京科园BPM工作平台'},
                    controller: "HomeCtr",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                files: [
                                    '/suite/plugins/metronic/theme/assets/global/plugins/morris/morris.css',
                                    '/suite/plugins/metronic/theme/assets/global/plugins/morris/morris.min.js',
                                    '/suite/plugins/metronic/theme/assets/global/plugins/morris/raphael-min.js',
                                    '/suite/plugins/metronic/theme/assets/global/plugins/jquery.sparkline.min.js',
                                    '/suite/plugins/metronic/theme/assets/pages/scripts/dashboard.min.js',
                                    'js/controllers/HomeCtr.js'
                                ]
                            });
                        }]
                    }
                })
                // User Profile
                .state("profile", {
                    url: "/profile",
                    templateUrl: "tpl/profile/main.html",
                    data: {pageTitle: '个人信息'},
                    controller: "UserProfileCtr",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    '/suite/plugins/metronic/theme/assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                    '/suite/plugins/metronic/theme/assets/pages/css/profile.css',
                                    '/suite/plugins/metronic/theme/assets/global/plugins/jquery.sparkline.min.js',
                                    '/suite/plugins/metronic/theme/assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                    '/suite/plugins/metronic/theme/assets/pages/scripts/profile.js',
                                    'js/controllers/UserProfileCtr.js'
                                ]
                            });
                        }]
                    }
                })
                // User Profile Dashboard
                .state("profile.dashboard", {
                    url: "/dashboard",
                    templateUrl: "tpl/profile/dashboard.html",
                    data: {pageTitle: '个人主页'}
                })
                // User Profile Account
                .state("profile.account", {
                    url: "/account",
                    templateUrl: "tpl/profile/account.html",
                    data: {pageTitle: '个人信息'},
                    controller: "UserAccountCtr",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    '/suite/plugins/metronic/theme/assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                    '/suite/plugins/metronic/theme/assets/global/plugins/angularjs/plugins/js/ng-file-upload-shim.min.js',
                                    '/suite/plugins/metronic/theme/assets/global/plugins/angularjs/plugins/js/ng-file-upload.min.js',
                                    '/suite/plugins/metronic/theme/assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                    'js/controllers/UserAccountCtr.js'
                                ]
                            });
                        }]
                    }
                })
                .state("profile.help", {
                    url: "/help",
                    templateUrl: "tpl/profile/help.html",
                    data: {pageTitle: 'User Help'}
                })
                .state('userProfile', {
                    url: "/userProfile/{userName}",
                    templateUrl: "tpl/profile/userProfile.html",
                    data: {pageTitle: '个人信息'},
                    controller: "UserProfileInfoCtr",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    '/suite/plugins/metronic/theme/assets/pages/css/profile.css',
                                    '/suite/plugins/metronic/theme/assets/global/plugins/jquery.sparkline.min.js',
                                    '/suite/plugins/metronic/theme/assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                    'js/controllers/UserProfileInfoCtr.js'
                                ]
                            });
                        }]
                    }
                })

                // 流程中心
                .state('processmodellist', {
                    url: '/processModelList',
                    templateUrl: 'tpl/processModel/processModelList.html',
                    data: {pageTitle: '流程中心'},
                    controller: "ProcessModelCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    'js/controllers/processModelListController.js'
                                ]
                            });
                        }]
                    }
                })
                // 流程中心 -- 查看详情
                .state('processmodelinfo', {
                    params: {processModelId: null},
                    url: '/processModelInfo/{processModelId:[0-9]{1,10}}',
                    templateUrl: 'tpl/processModel/processModelInfo.html',
                    data: {pageTitle: '流程模型'},
                    controller: "processModelInfoController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([{
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    'js/apps/processModel/processModelInfo.js'
                                ]
                            }]);
                        }]
                    }
                })
                .state('processInfo', {
                    params: {processId: null},
                    url: '/processInfo/{processId:[0-9]{1,10}}',
                    templateUrl: 'tpl/process/processInfo.html',
                    controller: "processInfoController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([{
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    'js/apps/process/processInfo.js'
                                ]
                            }]);
                        }]
                    }
                })

                // 流程中心 -- 发起流程
                .state('processmodelstart', {
                    params: {processModelId: null},
                    url: '/processModelStart/{processModelId:[0-9]{1,10}}',
                    templateUrl: 'tpl/processModel/processModelStart.html',
                    data: {pageTitle: '流程中心'},
                    controller: "processModelStartCtr",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([{
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    'js/processModel/processModelStartCtr.js'
                                ]
                            }]);
                        }]
                    }
                })
                //我的任务
                .state('task', {
                    url: "/task/inbox/{fold}",
                    templateUrl: "tpl/tasks/taskList.html",
                    data: {pageTitle: '我的任务'},
                    controller: "TaskCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    '/suite/plugins/metronic/theme/assets/apps/css/inbox.min.css',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/default/miniui.css',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/default/large-mode.css',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/pure/skin.css',
                                    'js/apps/tasks/task.js',
                                    '/suite/plugins/angulr/vendor/libs/moment.min.js'
                                ]
                            });
                        }]
                    }
                })
                .state('taskDetail', {
                    params: {taskId: null},
                    url: "/taskDetail/{taskId:[0-9]{1,10}}",
                    templateUrl: "tpl/tasks/taskDetail.html",
                    data: {pageTitle: '我的任务'},
                    controller: "TaskDetailCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: ['/suite/plugins/metronic/theme/assets/apps/css/todo.css',
                                    'js/apps/tasks/taskDetail.js',
                                    '/suite/plugins/angulr/vendor/libs/moment.min.js'
                                ]
                            });
                        }]
                    }
                })
                //我的发起
                .state('fileUpload', {
                    url: "/process/inbox/{fold}",
                    templateUrl: "tpl/process/process_list.html",
                    data: {pageTitle: '我的发起'},
                    controller: "processCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    '/suite/plugins/metronic/theme/assets/apps/css/inbox.min.css',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/default/miniui.css',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/default/large-mode.css',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/pure/skin.css',
                                    '/suite/plugins/angulr/vendor/libs/moment.min.js',
                                    'js/apps/process/processCtrl.js'
                                ]
                            });
                        }]
                    }
                })
                //文件传阅
                .state('documentRead', {
                    url: "/documentRead",
                    templateUrl: "tpl/documentRead/documentRead.html",
                    data: {pageTitle: '文件传阅'},
                    controller: "documentReadCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: ['/suite/plugins/metronic/theme/assets/apps/css/inbox.min.css',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/default/miniui.css',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/default/large-mode.css',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/pure/skin.css',
                                    'js/apps/documentRead/documentRead.js',
                                    '/suite/plugins/angulr/vendor/libs/moment.min.js'
                                ]
                            });
                        }]
                    }
                })
                .state('documentRead.documentInbox', {
                    params: {reportId: null},
                    url: "/documentInbox/{reportId:[0-9]{1,10}}",
                    templateUrl: "tpl/documentRead/documentInbox.html",
                    data: {pageTitle: '文件传阅'}
                })
                .state('documentRead.documentView', {
                    params: {taskId: null},
                    url: '/documentView/{taskId:[0-9]{1,10}}',
                    templateUrl: 'tpl/documentRead/documentView.html',
                    data: {pageTitle: '文件传阅'},
                    controller: "TaskDetailCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([{
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    'js/apps/tasks/taskDetail.js'
                                ]
                            }]);
                        }]
                    }
                })
                .state('documentRead.documentInfo', {
                    params: {processId: null},
                    url: '/documentInfo/{processId:[0-9]{1,10}}',
                    templateUrl: 'tpl/documentRead/documentInfo.html',
                    controller: "processInfoController",
                    data: {pageTitle: '文件传阅'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([{
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    'js/apps/process/processInfo.js'
                                ]
                            }]);
                        }]
                    }
                })

                .state('documentRead.documentComposeStart', {
                    params: {processModelId: null},
                    url: '/documentComposeStart/{processModelId:[0-9]{1,10}}',
                    templateUrl: 'tpl/documentRead/documentComposeStart.html',
                    controller: "processModelStartCtr",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([{
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    'js/apps/processModel/processModelStart.js'
                                ]
                            }]);
                        }]
                    }
                })
                .state('documentRead.documentRecord', {
                    params: {statuId: null},
                    url: "/documentRecord/{statuId:[0-9]{1,10}}",
                    templateUrl: "tpl/documentRead/documentRecord.html",
                    data: {pageTitle: '文件传阅'}
                })
                .state('accounmentRead', {
                    url: "/accounmentRead",
                    templateUrl: "tpl/accounmentRead/accounmentRead.html",
                    data: {pageTitle: '通知公告'},
                    controller: "accounmentAllController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: ['/suite/plugins/metronic/theme/assets/apps/css/inbox.min.css',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/default/miniui.css',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/default/large-mode.css',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/pure/skin.css',
                                    'js/apps/accounmentRead/accounmentRead.js',
                                    '/suite/plugins/angulr/vendor/libs/moment.min.js'
                                ]
                            });
                        }]
                    }
                })
                .state('accounmentRead.accounmentInbox', {
                    params: {forumId: null, forumName: null},
                    url: "/accounmentInbox",
                    templateUrl: "tpl/accounmentRead/accounmentInbox.html",
                    data: {pageTitle: '通知公告'}
                })
                .state('accounmentRead.accounmentStart', {
                    url: '/accounmentStart',
                    templateUrl: 'tpl/accounmentRead/accounmentStart.html'
                })
                .state('accounmentRead.accounmentView', {
                    url: '/accounmentView/{threadId:[0-9]{1,10}}',
                    templateUrl: 'tpl/accounmentRead/accounmentView.html',
                    controller: "announcementDetailController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([{
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    'js/apps/announcement/announcementDetail.js'
                                ]
                            }]);
                        }]
                    }
                })

                //数据中心
                .state('chart_hightable', {
                    url: '/chart_hightable.html',
                    templateUrl: 'tpl/report/chart_hightable.html',
                    data: {pageTitle: '数据中心'},
                    controller: "chartHightableCtr",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([{
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    'js/report/chartHightableCtr.js'
                                ]
                            }]);
                        }]
                    }
                })
                //新闻资讯
                .state("nonfometNews", {
                    url: "/nonfometNews",
                    templateUrl: "tpl/news/news.html",
                    controller: "newsController",
                    data: {pageTitle: '新闻资讯'},

                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: "MaterialApp",
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    'js/apps/news/news.js',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/default/miniui.css',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/default/large-mode.css',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/pure/skin.css'
                                ]
                            });
                        }]
                    }
                })
                .state('newsStart', {
                    params: {processModelId: null},
                    url: '/newsStart/{processModelId:[0-9]{1,10}}',
                    templateUrl: 'tpl/news/newsStart.html',
                    controller: "processModelStartCtr",
                    data: {pageTitle: '新闻发布'},

                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([{
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    'js/apps/processModel/processModelStart.js'
                                ]
                            }]);
                        }]
                    }
                })
                .state('nonfometNewsDetail', {
                    params: {threadId: null},
                    url: '/nonfometNewsDetail/{threadId:[0-9]{1,10}}',
                    templateUrl: 'tpl/news/newsDetail.html',
                    data: {pageTitle: '新闻详情页'}

                })
                .state('nonfometNewsSearch', {
                    params: {forumId: null},
                    url: '/nonfometNewsSearch/{forumId:[0-9]{1,10}}',
                    templateUrl: 'tpl/news/newsSearch.html',
                    controller: "GeneralPageController",
                    data: {pageTitle: '新闻查询'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([{
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    '/suite/plugins/metronic/theme/assets/pages/css/search.min.css',
                                    'js/apps/news/GeneralPageController.js'
                                ]
                            }]);
                        }]
                    }
                })
                .state('nonfometNewsAdd', {
                    url: '/nonfometNewsAdd',
                    templateUrl: 'tpl/news/newsAdd.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([{
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    '/suite/plugins/metronic/theme/assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                    '/suite/plugins/metronic/theme/assets/global/plugins/bootstrap-summernote/summernote.css',
                                    '/suite/plugins/metronic/theme/assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js'
                                ]
                            }]);
                        }]
                    }
                })
                //知识中心
                .state('knowledgeCenter', {
                    url: "/knowledgeCenter",
                    templateUrl: "tpl/knowledgeCenter/knowledgeCenter.html",
                    data: {pageTitle: '知识中心'},
                    controller: "knowledgeCenterCtr",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MaterialApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: ['/suite/plugins/metronic/theme/assets/apps/css/todo-2.css',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/default/miniui.css',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/default/large-mode.css',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/pure/skin.css',
                                    '/suite/plugins/metronic/theme/assets/apps/scripts/todo-2.js',
                                    'js/apps/knowledgeCenter/knowledgeCenter.js',
                                    '/suite/plugins/angulr/vendor/libs/moment.min.js'
                                ]
                            });
                        }]
                    }
                })
                .state('knowledgeCenter.nodeInfo', {
                    params: {nodeId: null, nodeName: null},
                    url: "/nodeInfo/{nodeId:[0-9]{1,10}}/:nodeName",
                    templateUrl: "tpl/knowledgeCenter/nodeInfo.html",
                    data: {pageTitle: '知识中心'}
                })
                .state('knowledgeCenter.nodeInfoKc', {
                    params: {nodeId: null, nodeName: null},
                    url: "/nodeInfoKc/{nodeId:[0-9]{1,10}}/:nodeName",
                    templateUrl: "tpl/knowledgeCenter/nodeInfoKc.html",
                    data: {pageTitle: '知识中心'}
                })
                .state('knowledgeCenter.nodeInfoCm', {
                    params: {nodeId: null, nodeName: null},
                    url: "/nodeInfoCm/{nodeId:[0-9]{1,10}}/:nodeName",
                    templateUrl: "tpl/knowledgeCenter/nodeInfoCm.html",
                    data: {pageTitle: '知识中心'}
                })
                .state('knowledgeCenter.nodeInfoFa', {
                    url: "/nodeInfoFa",
                    templateUrl: "tpl/knowledgeCenter/nodeInfoFa.html",
                    data: {pageTitle: '知识中心'}
                })
                //通讯录
                .state("userProfileList", {
                    url: "/userProfileList",
                    templateUrl: "tpl/profile/usersProfilesList.html",
                    controller: "UserProfileController",
                    data: {pageTitle: '通讯录'},
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([{
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/default/miniui.css',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/default/large-mode.css',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/bootstrap/skin.css',
                                    'js/controllers/UserProfileController.js'
                                ]
                            }]);
                        }]
                    }
                })

                .state('reportPage', {
                    url: '/reportPage/{page}',
                    templateUrl: 'tpl/page/page.html',
                    data: {pageTitle: '流程报表'},

                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['js/apps/page/page.js']);
                            }]
                    }
                })


                .state('notification', {
                    url: '/notification',
                    templateUrl: 'tpl/notification/notificationTab.html',
                    data: {pageTitle: '通知消息'},

                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load([
                                    '/suite/plugins/metronic/theme/assets/apps/css/todo-2.min.css',
                                    'js/apps/notification/notification.js',
                                    '/suite/plugins/angulr/vendor/libs/moment.min.js',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/default/miniui.css'
                                ]);
                            }]
                    }
                })
                .state('notificationDetailId', {
                    params: {attribute: null},
                    url: '/notificationDetailId',
                    templateUrl: 'tpl/notification/notiMessageDetail.html',
                    controller: "NotiMessageDetailCtrl",
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['js/apps/notification/notiMessageDetail.js'
                                ]);
                            }]
                    }
                })

                .state('titleMessageDetail', {
                    params: {attribute: null},
                    url: '/titleMessageDetail',
                    templateUrl: 'tpl/notification/titleMessageDetail.html',
                    controller: "titleMessageDetailCtrl",
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['js/apps/notification/titleMessageDetail.js'
                                ]);
                            }]
                    }
                })
                .state('personalizedMessageDetail', {
                    params: {attribute: null},
                    url: '/personalizedMessageDetail',
                    templateUrl: 'tpl/notification/personalizedMessageDetail.html',
                    controller: "personalizedMessageDetailCtrl",
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['js/apps/notification/personalizedMessageDetail.js'
                                ]);
                            }]
                    }
                })
                .state('portalMessageDetail', {
                    params: {attribute: null},
                    url: '/portalMessageDetail',
                    templateUrl: 'tpl/notification/portalMessageDetail.html',
                    controller: "portalMessageDetailCtrl",
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['js/apps/notification/portalMessageDetail.js'
                                ]);
                            }]
                    }
                })
                .state('cooperationMessageDetail', {
                    params: {attribute: null},
                    url: '/cooperationMessageDetail',
                    templateUrl: 'tpl/notification/cooperationMessageDetail.html',
                    controller: "cooperationMessageDetailCtrl",
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['js/apps/notification/cooperationMessageDetail.js'
                                ]);
                            }]
                    }
                })
                .state('sendMessageDetail', {
                    params: {attribute: null},
                    url: '/sendMessageDetail',
                    templateUrl: 'tpl/notification/sendMessageDetail.html',
                    controller: "sendMessageDetailCtrl",
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['js/apps/notification/sendMessageDetail.js'
                                ]);
                            }]
                    }
                })
                .state('taskMessageDetail', {
                    params: {attribute: null},
                    url: '/taskMessageDetail',
                    templateUrl: 'tpl/notification/taskMessageDetail.html',
                    controller: "taskMessageDetailCtrl",
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['js/apps/notification/taskMessageDetail.js'
                                ]);
                            }]
                    }
                })
                //其他平台和我的邮箱
                .state('otherPlatform', {
                    params: {platformId: null},
                    data:{pageTitle:""},
                    url: '/otherPlatform/{platformId:[0-9]{1,10}}',
                    templateUrl: 'tpl/otherPlatform/otherPlatform.html',
                    controller: "otherPlatformCtrl",
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load([
                                    'js/apps/otherPlatform/otherPlatformCtrl.js'
                                ]);
                            }]
                    }
                })

                .state('userProfileFunction', {
                    params: {platformId: null},
                    data: {pageTitle: '功能节点维护'},
                    url: '/userProfileFunction',
                    templateUrl: 'tpl/profile/userProfileFunction.html',
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load([
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/default/miniui.css',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/default/large-mode.css',
                                    '/suite/plugins/processAndTasks/miniui3.6/themes/bootstrap/skin.css']);
                            }]
                    }
                })


        }
    ])

