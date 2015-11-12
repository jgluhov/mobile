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

  $scope.onChange = function(text) {
    if(_.isEmpty(text)) {
      if ($scope.popover.emotion.state)
        $scope.popover.emotion.state = false;
      return;
    }


    StateService.search(text, 3).then(function(res) {
      if(!_.isEmpty(res.data)) {
        $scope.popover.emotion.state = true;
        $scope.popover.emotion.messages = StateService.compile(res.data)
      } else {
        $scope.popover.emotion.state = false;
      }
    })
  };

  $scope.submit = function() {
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