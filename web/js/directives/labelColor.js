angular.module('MaterialApp').directive('labelColor', function(){
    return function(scope, $el, attrs){
        $el.css({'color': attrs.color});
    }
});
