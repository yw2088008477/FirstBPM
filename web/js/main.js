'use struct';

/* Controllers */
angular.module('MaterialApp')
    .controller('AppController', ['$rootScope', '$scope', '$window', '$state', '$translate','processDetailFactory',
        function ($rootScope, $scope, $window, $state, $translate,processDetailFactory) {
            // config
            $scope.app = {
                settings: {
                    layout: {
                        pageSidebarClosed: false, // sidebar menu state
                        pageContentWhite: true, // solid body color state
                        pageBodySolid: false,// set page content layout
                        pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
                    },
                    assetsPath: '/suite/plugins/metronic/theme/assets',
                    globalPath: '/suite/plugins/metronic/theme/assets/global',
                    layoutPath: '/suite/plugins/metronic/theme/assets/layouts/layout3',
                }
            };
            $scope.$on('$viewContentLoaded', function () {
                App.initComponents();
                Layout.init();
            });

            $scope.reloadPage = function () {
                $state.reload();
            };
            // angular translate
            $scope.logoName = "logo.png";

            $scope.lang = {isopen: false};
            $scope.langs = {zh_CN: '中文', en_EN: 'English'};
            $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "中文";
            $scope.setLang = function (langKey, $event) {
                // set the current lang
                $scope.selectLang = $scope.langs[langKey];
                // You can change the language during runtime
                $translate.use(langKey);
                $scope.lang.isopen = !$scope.lang.isopen;
            };

           // 获取用户信息
            processDetailFactory.getloginUserInfo();
            $scope.$on('loginuserInfoUpdata',function (event,data) {
                var userInfo=data.data;
                $rootScope.userInfo=$scope.userInfo=userInfo;
            });

            //获取通知数量
            processDetailFactory.getnotificationscount();
            $scope.$on("notificationscountUpdata",function(event,data){
                $rootScope.getnotificationscount=$scope.getnotificationscount=data.data;
            })

            //获取流程发起记录数量
            processDetailFactory.getProcessPortalCount();
            $scope.$on("ProcessPortalCountUpdata",function(event,data){
                var processCount=data.data;
                $rootScope.processCount=$scope.processCount=processCount;
                var cyProcessData = {};
                var swProcessData = {};
                var fwProcessData = {};
                var qtProcessData = {};
                if (processCount.length > 0) {
                    cyProcessData = {
                        cyonNu: processCount[0].cyonNu,
                        cycancelNu: processCount[0].cycancelNu,
                        cyproNu: processCount[0].cyproNu,
                        cyallNu: processCount[0].cyallNu,
                        cyendNu: processCount[0].cyendNu
                    };
                    swProcessData = {
                        swonNu: processCount[2].swonNu,
                        swendNu: processCount[2].swendNu,
                        swcancelNu: processCount[2].swcancelNu,
                        swproNu: processCount[2].swproNu,
                        swallNu: processCount[2].swallNu
                    };
                    fwProcessData = {
                        fwonNu: processCount[1].fwonNu,
                        fwendNu: processCount[1].fwendNu,
                        fwcancelNu: processCount[1].fwcancelNu,
                        fwproNu: processCount[1].fwproNu,
                        fwallNu: processCount[1].fwallNu
                    };
                    qtProcessData = {
                        qtonNu: processCount[3].qtonNu,
                        qtendNu: processCount[3].qtendNu,
                        qtcancelNu: processCount[3].qtcancelNu,
                        qtproNu: processCount[3].qtproNu,
                        qtallNu: processCount[3].qtallNu,
                        qtStopNu: processCount[3].qtStopNu,
                        emergencyCount: processCount[3].emergencyCount
                    };
                }
                $rootScope.cyProcessData=$scope.cyProcessData=cyProcessData;
                $rootScope.swProcessData=$scope.swProcessData=swProcessData;
                $rootScope.fwProcessData=$scope.fwProcessData=fwProcessData;
                $rootScope.qtProcessData=$scope.qtProcessData=qtProcessData;
                if($scope.processCount==null){
                    $rootScope.processCount=$scope.processCount={statusall:0};
                }
            })

            //获取应用
            processDetailFactory.getapplications();
            $scope.$on("applicationsUpdata",function(event,data){
                $rootScope.applications=$scope.applications=data.data;
            })

            //获取登录人权限
            processDetailFactory.getLogInUserFunction();
            $scope.$on("logInUserFunctionUpdata",function(event,data){
                var isFunction=data.data;
                var fkFunc = false;
                var gxFunc = false;
                var syFunc = false;
                var dyFunc = false;
                var homeFunc = false;
                var adminFunc = false;
                $rootScope.dyFunc =$scope.dyFunc = dyFunc;
                $rootScope.fkFunc =$scope.fkFunc = fkFunc;
                $rootScope.syFunc =$scope.syFunc = syFunc;
                $rootScope.gxFunc =$scope.gxFunc = gxFunc;
                $rootScope.homeFunc =$scope.homeFunc=homeFunc;
                $rootScope.adminFunc =$scope.adminFunc=adminFunc;
            })

            //获取任务数量
            processDetailFactory.getTaskCountByPmModel();
            $scope.$on("taskCountByPmModelUpdata",function(event,data){
                var taskCount=data.data;
                $rootScope.taskCount=$scope.taskCount=taskCount;
                var cyTaskData = {};
                var swTaskData = {};
                var fwTaskData = {};
                var qtTaskData = {};
                if (taskCount.length > 0) {
                    cyTaskData = {
                        cyTask: taskCount[0].cyNu,
                        cyTaskWait: taskCount[0].cyNuWait,
                        cyTaskEnd: taskCount[0].cyNuEnd,
                        cyTaskOn: taskCount[0].cyNuOn,
                        cyTaskAll: taskCount[0].cyNuAll
                    };
                    swTaskData = {
                        swTask: taskCount[2].swNu,
                        swTaskWait: taskCount[2].swNuWait,
                        swTaskEnd: taskCount[2].swNuEnd,
                        swTaskOn: taskCount[2].swNuOn,
                        swTaskAll: taskCount[2].swNuAll
                    };
                    fwTaskData = {
                        fwTask: taskCount[1].fwNu,
                        fwTaskWait: taskCount[1].fwNuWait,
                        fwTaskEnd: taskCount[1].fwNuEnd,
                        fwTaskOn: taskCount[1].fwNuOn,
                        fwTaskAll: taskCount[1].fwNuAll
                    };
                    qtTaskData = {
                        qtTask: taskCount[4].qtNu,
                        qtTaskWait: taskCount[4].qtNuWait,
                        qtTaskEnd: taskCount[4].qtNuEnd,
                        qtTaskOn: taskCount[4].qtNuOn,
                        qtTaskAll: taskCount[4].qtNuAll,
                        qtTaskPro: taskCount[4].qtTaskPro
                    };
                }
                $rootScope.cyTaskData=$scope.cyTaskData=cyTaskData;
                $rootScope.swTaskData=$scope.swTaskData=swTaskData;
                $rootScope.fwTaskData=$scope.fwTaskData=fwTaskData;
                $rootScope.qtTaskData=$scope.qtTaskData=qtTaskData;
                $scope.total = (parseInt($scope.fwTaskData.fwTask) + parseInt($scope.swTaskData.swTask)).toString();
                if($scope.taskCount==null){
                    $rootScope.taskCount=$scope.taskCount={statusall:0,status2:0};
                }
            })

            $scope.$watch("selectLang", function (nv, ov) {
                if (nv == "English") {
                    $('#selecteLang_style').attr("href", "/suite/plugins/metronic/theme/assets/pages/scripts/style.english.css");
                } else {
                    $('#selecteLang_style').attr("href", "/suite/plugins/metronic/theme/assets/pages/scripts/style.css");
                }
            });
        }
    ]);

/* Setup Layout Part - Header */
angular.module('MaterialApp')
    .controller('HeaderController', ['$scope', '$state', function ($scope, $state) {
        $scope.$on('$includeContentLoaded', function () {
            Layout.initHeader(); // init header
        });

        $scope.openOherPlatform = function (index) {
            $state.go("otherPlatform",{platformId: index});
        }

    }]);


