var zeroState = angular.module('zeroState', ["ngResource", "ngRoute", "ui.bootstrap", "ui-notification"]);

zeroState.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });

      $routeProvider
        .when("/", {
          templateUrl: "templates/home",
          controller: "StateController"
        })
    }
  ]
);

zeroState.config(function(NotificationProvider) {
  NotificationProvider.setOptions({
    delay: 3000,
    startTop: 0,
    startRight: 0,
    verticalSpacing: 5,
    horizontalSpacing: 0,
    positionY: 'top'
  });
});

zeroState.controller('StateController', ['$scope','StateService', 'Notification', function($scope, StateService, notify) {
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
    if(_.isUndefined(newValue) || _.isEmpty(newValue)) {
      if ($scope.popover.emotion.state)
        $scope.popover.emotion.state = false;
      return;
    }
    StateService.search(newValue, 3).then(function(res) {
      if(!_.isEmpty(res.data)) {
        $scope.popover.emotion.state = true;
        $scope.popover.emotion.messages = StateService.compile(res.data)
      } else {
        $scope.popover.emotion.state = false;
      }
    })
  });

  $scope.submit = function(stateForm) {
    if(stateForm.$invalid) return;
    StateService.create($scope.state).then(function() {
      notify.success({message:'Your State successfully added!'});
      $scope.state = StateService.model();
      if ($scope.popover.emotion.state)
        $scope.popover.emotion.state = false;
    })
  }




}]);


zeroState.constant('StateConstants', {
  local: 'http://192.168.0.113:8010/'
});


zeroState.service('StateService', ['$http', '$sce', 'StateConstants', function($http, $sce, StateConstants) {

  this.create = function(data) {
    return $http.post('http://192.168.0.113:8010/states', data);
  };

  this.search = function(name, limit) {
    return $http.get(StateConstants.local + 'emotions?name=' + name + '&limit=' + limit);
  };


  this.compile = function(messages) {
    var compiled = _.template('<ul class="list-unstyled">' +
      '<% _.forEach(messages, function(message) { %><li><%- message.name %></li><% }); %></ul>');
    return $sce.trustAsHtml(compiled({'messages': messages}));
  };

  this.model = function() {
    return {
      emotions: [{name: ''}],
      record: {
        title: ''
      }
    };
  }

}]);

zeroState
  .directive('focus', function($timeout, $parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.$watch(attrs.focus, function(newValue, oldValue) {
          if (newValue) { element[0].focus(); }
        });
        element.bind("blur", function(e) {
          $timeout(function() {
            scope.$apply(attrs.focus + "=false");
          }, 0);
        });
        element.bind("focus", function(e) {
          $timeout(function() {
            scope.$apply(attrs.focus + "=true");
          }, 0);
        })
      }
    }
  });