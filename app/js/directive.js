angular.module('directive',[]);
angular.module('directive').directive('fileInput', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('change', function () {
                $parse(attrs.fileInput).assign(scope, elem[0].image);
                scope.$apply();
            });
        }
    }
});
