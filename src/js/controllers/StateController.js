module.exports = function(app) {
  app.controller('StateController', ['$scope', 'StateService', 'StateConstants', 'Notification', '$http',
    function ($scope, StateService, StateConstants, notify, $http) {
      $scope.state = StateService.model();

      $scope.popover = {
        emotion: {
          state: false,
          message: ''
        }
      };
      
      var session = null;

      var params = {
        token: StateConstants.token,
        email: 'jgluhov@gmail.com',
        password: 'Mathemat1cs'
      };
      
      $http.get(StateConstants.production + 'auth', { params: params }).then(function(res) {
        session = res.data.sessionId;
      });

      $scope.$watch(function () {
        return $scope.state.emotions[0].name;
      }, function (newValue) {
        if (_.isUndefined(newValue) || _.isEmpty(newValue)) {
          if ($scope.popover.emotion.state)
            $scope.popover.emotion.state = false;
          return;
        }

        StateService.search(newValue.toLowerCase(), 3).then(function (res) {
          if (!_.isEmpty(res.data) && !_.isUndefined($scope.state.emotions[0].name)) {
            $scope.popover.emotion.state = true;
            $scope.popover.emotion.messages = StateService.compile(res.data)
          } else {
            $scope.popover.emotion.state = false;
          }
        })
      });

      $scope.submit = function (stateForm) {
        if (stateForm.$invalid) {
          return;
        }

        $scope.state.session = session;

        StateService.create($scope.state).then(function () {
          notify.success({message: 'Your State successfully added!'});
          $scope.state = StateService.model();          
          if ($scope.popover.emotion.state)
            $scope.popover.emotion.state = false;
        });
      };
    }]);
};