AppTodo2.init(); // init todo page
$(function() {
    $("li").click(function() {
        //          第一种方法
        //          $("li").removeClass("active");//删除指定的 class 属性
        //          $(this).addClass("active");//向被选元素添加一个或多个类
        // $(this).toggleClass("active");//该函数会对被选元素进行添加/删除类的切换操作
        var text = $(this).text();//获取当前选中的文本
        //或者使用第二种方法
        $(this).addClass("active").siblings().removeClass("active");
    });
});

mini.parse();
var tree=mini.get("tree1");
angular.module('MaterialApp').controller('TabsDemoCtrl', ['$scope','$http','$rootScope','$state',function($scope,$http,$rootScope,$state) {

    $scope.reloadPage=function(){

        $state.reload();
    }

    $scope.lookPage=function(e){

        $('.nav-stacked > li.active').removeClass('active');
        $(e.target).closest('li').addClass('active');
        $state.go('knowledgeCenter.nodeInfoFa');
    }

    tree.on("nodeclick",function(e){
        var node=e.node;
        $state.go('knowledgeCenter.nodeInfo',{nodeId:node.id,nodeName:node.name});
    });
}]);
