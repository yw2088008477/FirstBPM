angular.module('MaterialApp')
    .controller('TaskListCtrl', ['$scope', '$stateParams', '$state' ,'$uibModal', '$log','$rootScope', function($scope, $stateParams,$state, $uibModal, $log,$rootScope) {
        if($scope.searchTasks!=null){
            $rootScope.searchTasks = $scope.searchTasks;
        }else{
            $scope.searchTasks = $rootScope.searchTasks;
        }
        $scope.filteredTodos = []
            ,$scope.currentPage = 1
            ,$scope.numPerPage = 10
            ,$scope.maxSize = 10;
        var rstasks;
        var totalCount = 0;

        $scope.$watch("currentPage + numPerPage", function() {
            var type="status"
            if($stateParams.fold==""||$stateParams.fold=="-1"||$stateParams.fold=="0"||$stateParams.fold=="1"||$stateParams.fold=="2"){
                type="status"
            }else{
                type=$stateParams.fold;
            }
            rstasks = query("GM_Portal_Query_Tasks",{"type":type,"status":$stateParams.fold,"indexnum":$scope.currentPage*$scope.numPerPage-($scope.maxSize-1),"pagenum":$scope.maxSize,"searchTasks":$scope.searchTasks,pmId:$rootScope.taskSelectedProcessModelId})[0];
            if(rstasks.totalCount==0){
                $("#noTask").show();
            }else{
                $("#noTask").hide();
            }
            totalCount = (rstasks.totalCount/10)*10;
            if($stateParams.fold==-1){
                $("#navsTaskAllCount").html(totalCount);
                if($stateParams.fold!=1){
                    if(totalCount==0){
                        $("#navsTaskAllCount").hide();
                    }else{
                        $("#navsTaskAllCount").show();
                    }
                }
            }
            $scope.makeTodos();
            var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
            $scope.filteredTodos = $scope.todos.slice(begin, end);
            $scope.tasks = rstasks.tasks;
        });

        $scope.searchTasksed = function(){
            $rootScope.searchTasks = $scope.searchTasks;
            var type="status"
            if($stateParams.fold==""||$stateParams.fold=="-1"||$stateParams.fold=="0"||$stateParams.fold=="1"||$stateParams.fold=="2"){
                type="status"
            }else{
                type=$stateParams.fold;
            }
            rstasks = query("GM_Portal_Query_Tasks",{"type":type,"status":$stateParams.fold,"indexnum":$scope.currentPage*$scope.numPerPage-($scope.maxSize-1),"pagenum":$scope.maxSize,"searchTasks":$scope.searchTasks,pmId:$rootScope.taskSelectedProcessModelId})[0];
            if(rstasks.totalCount==0){
                $("#noTask").show();
            }else{
                $("#noTask").hide();
            }
            totalCount = (rstasks.totalCount/10)*10;
            $scope.makeTodos();
            var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
            $scope.filteredTodos = $scope.todos.slice(begin, end);
            $scope.tasks = rstasks.tasks;
        }


        $scope.makeTodos = function() {
            $scope.todos = [];
            for (i=1;i<=totalCount;i++) {
                $scope.todos.push({ text:"todo "+i, done:false});
            }
        };

        $scope.labelClass = function(label) {
            return {
                'b-l-info': angular.lowercase(label) === 1,
                'b-l-warning': angular.lowercase(label) === 0,
                'b-l-success': angular.lowercase(label) === 2
            };
        };

        $scope.bgClass = function(label) {
            return {
                'bg-info': angular.lowercase(label) === 1,
                'bg-warning': angular.lowercase(label) === 0,
                'bg-success': angular.lowercase(label) === 2
            };
        };

        $scope.taskAllCheck = function(){
            if($(".taskAllCheck").attr("checked")==null){
                $(".taskAllCheck").attr("checked",true);
                $(".taskCheck").attr("checked",true);
                $(".taskCheck").next("i").css("border-color","#23B7E5");
                $(".taskCheck").next("i").append("<i class='newCheckedI' style='top: 4px;left: 4px;width: 10px;height: 10px;background-color: #23B7E5;position: absolute;'></i>");

            }else{
                $(".taskAllCheck").attr("checked",false);
                $(".taskCheck").attr("checked",false);
                $(".taskCheck").next("i").css("border-color","");
                $(".taskCheck").next("i").css("background-color","");
                $(".taskCheck").next("i").find(".newCheckedI").remove();
            }
        }


        $scope.acceptTasks = function(){
            var taskIds = $(".taskCheck:checked");
            if(taskIds.length>0){
                for(var i=0;i<taskIds.length;i++){
                    acceptTask(taskIds.eq(i).val())
                }
                setTimeout(function(){
                    $state.reload();
                }, 500);
            }else{
                alert("请选择至少一条记录");
            }

        }

        $scope.completeAgreeTasks = function(){
            var taskIds = $(".taskCheck:checked");
            if(taskIds.length>0){
                if(confirm("确定批量提交为同意吗？"))
                {
                    for(var i=0;i<taskIds.length;i++){
                        var taskId=taskIds.eq(i).val();
                        //if(query("gettaskdetails",{id:taskId})[0].hiddenSections==1){
                        var data = {};
                        data["formData"] = '{"submitFlag":"同意"}';
                        completeTasks(taskId,data)
                        execute("createprocessnote",{id:"",content:"同意（批量同意）",attachs:"",taskId:taskId})
                        //}
                    }
                    $state.reload();
                }
            }else{
                alert("请选择至少一条记录");
            }
        }
        $scope.completeRefuseTasks = function(){
            var taskIds = $(".taskCheck:checked");
            if(taskIds.length>0){
                if(confirm("确定批量提交为拒绝吗？"))
                {
                    for(var i=0;i<taskIds.length;i++){
                        var taskId=taskIds.eq(i).val();
                        var data = {};
                        data["formData"] = '{"submitFlag":"拒绝"}';
                        completeTasks(taskId,data)
                        execute("createprocessnote",{id:"",content:"拒绝（批量拒绝）",attachs:"",taskId:taskId})
                    }
                    $state.reload();
                }
            }else{
                alert("请选择至少一条记录");
            }
        }



        $scope.open = function (url,size) {
            var modalInstance = $uibModal.open({
                templateUrl: url,
                controller: 'TaskModalInstanceCtrl',
                size: size
            });

        };
        $scope.reassignTask = function (url,size) {
            var taskIds = $(".taskCheck:checked");
            if(taskIds.length>0){
                $scope.open(url,size);
            }else{
                alert("请选择至少一条记录");
            }
        };


    }]);

