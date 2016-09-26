angular.module('imgCropApp', ['ui.router','controllers','directive','service']);


angular.module('imgCropApp').config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider.state('main', {
        url: '/',
        controller: 'MainController',
        templateUrl: '../templates/main.html'
    }).state('cropped',{
        url: '/cropped/:file',
        controller: 'CroppedController',
        templateUrl: '../templates/cropped.html'
    });
    $urlRouterProvider.otherwise('main');
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});


