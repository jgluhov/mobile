module.exports = function(app) {
  app.service('StateService', ['$http', '$sce', 'StateConstants', function ($http, $sce, StateConstants) {

    this.create = function (data) {
      var params = data;      
      data.lang = {
        code : 'en'
      };

      data.name = data.emotions[0].name;

      return $http.post(StateConstants.production + 'emotions?token=' + StateConstants.token + '&session=' + data.session + '&base=false', data);
    };

    this.search = function (name, limit) {
      return $http.get(StateConstants.production + 'emotions?name=' + name + '&limit=' + limit + '&token=' + StateConstants.token);
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
};