var zeroState = angular.module('zeroState', ["ngResource", "ngRoute"]);

zeroState.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });

      $routeProvider
        .when("/", {
          templateUrl: "templates/home",
          controller: "HomeIndexController"
        })

        .when('/knowledges', {
          templateUrl: "templates/knowledges",
          controller: "KnowledgesIndexController"
        })
    }
  ]
);


zeroState.controller('HomeIndexController', function($scope) {
  $scope.message = 'Everyone come and see how good I look!';
});

zeroState.controller('KnowledgesIndexController', function($scope) {
  $scope.message = 'Everyone come and see how good I look!';
});