'use strict';

var app = angular.module('zeroState', ['ngResource','ngRoute','ui.bootstrap','ui-notification']);

var StateService = require('./services/StateService')(app);
var StateConstants = require('./constants/StateConstants')(app);
var StateController = require('./controllers/StateController')(app);
var FocusDirective = require('./directives/FocusDirective')(app);

app.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });

      $routeProvider
        .when("/", {
          templateUrl: "templates/home",
          controller: "StateController"
        });
    }
  ]
);

app.config(['NotificationProvider', function (NotificationProvider) {
  NotificationProvider.setOptions({
    delay: 3000,
    startTop: 0,
    startRight: 0,
    verticalSpacing: 5,
    horizontalSpacing: 0,
    positionY: 'top'
  });
}]);
