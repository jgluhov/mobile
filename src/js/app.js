var zeroState = angular.module('zeroState',
  ["ngResource", "ngRoute", 'ipCookie', "ui.bootstrap", "ui-notification"]);

zeroState.config(['$routeProvider', '$locationProvider', '$httpProvider',
    function ($routeProvider, $locationProvider, $httpProvider) {
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });

      $routeProvider
        .when("/", {
          templateUrl: "templates/home",
          controller: "StateController"
        });


      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
  ]
);

zeroState.config(function (NotificationProvider) {
  NotificationProvider.setOptions({
    delay: 3000,
    startTop: 0,
    startRight: 0,
    verticalSpacing: 5,
    horizontalSpacing: 0,
    positionY: 'top'
  });
});

zeroState.constant('StateConstants', {
  local: 'http://192.168.0.113:8010/',
  production: 'https://idemind-api.herokuapp.com/',
  token: 'ae33d6face3d0a8882059e2583725b786c2c4fb96e7c5805b4cdb0590292edfc'
});

zeroState.controller('StateController', ['$scope', 'ipCookie', 'StateService', 'StateConstants', 'Notification',
  function ($scope, ipCookie, StateService, StateConstants, notify) {

    ipCookie('token', StateConstants.token, { domain: 'idemind-api.herokuapp.com' });


    $scope.state = StateService.model();

    $scope.popover = {
      emotion: {
        state: false,
        message: ''
      }
    };


    $scope.$watch(function () {
      return $scope.state.emotions[0].name;
    }, function (newValue) {
      if (_.isUndefined(newValue) || _.isEmpty(newValue)) {
        if ($scope.popover.emotion.state)
          $scope.popover.emotion.state = false;
        return;
      }
      StateService.search(newValue, 3).then(function (res) {
        if (!_.isEmpty(res.data)) {
          $scope.popover.emotion.state = true;
          $scope.popover.emotion.messages = StateService.compile(res.data)
        } else {
          $scope.popover.emotion.state = false;
        }
      })
    });

    $scope.submit = function (stateForm) {
      if (stateForm.$invalid) return;
      StateService.create($scope.state).then(function () {
        notify.success({message: 'Your State successfully added!'});
        $scope.state = StateService.model();
        if ($scope.popover.emotion.state)
          $scope.popover.emotion.state = false;
      })
    }


  }]);



zeroState.service('StateService', ['$http', '$sce', 'StateConstants', function ($http, $sce, StateConstants) {

  this.create = function (data) {
    return $http.post(StateConstants.production + 'states', data);
  };

  this.search = function (name, limit) {
    return $http.get(StateConstants.production + 'emotions?name=' + name + '&limit=' + limit);
  };


  this.compile = function (messages) {
    var compiled = _.template('<ul class="list-unstyled">' +
      '<% _.forEach(messages, function(message) { %><li><%- message.name %></li><% }); %></ul>');
    return $sce.trustAsHtml(compiled({'messages': messages}));
  };

  this.model = function () {
    return {
      emotions: [{name: ''}],
      record: {
        title: ''
      }
    };
  }

}]);

zeroState
  .directive('focus', function ($timeout, $parse) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.$watch(attrs.focus, function (newValue, oldValue) {
          if (newValue) {
            element[0].focus();
          }
        });
        element.bind("blur", function (e) {
          $timeout(function () {
            scope.$apply(attrs.focus + "=false");
          }, 0);
        });
        element.bind("focus", function (e) {
          $timeout(function () {
            scope.$apply(attrs.focus + "=true");
          }, 0);
        })
      }
    }
  });