var zeroState = angular.module('zeroState', ["ngResource", "ngRoute"]);

zeroState.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });

      $routeProvider
        .when("/", {
          templateUrl: "templates/home.jade",
          controller: "homeController"
        })
    }
  ]
);


zeroState.controller('homeController', function($scope) {
  $scope.message = 'Everyone come and see how good I look!';
});