module.exports = function(app) {
  app.constant('StateConstants', {
    local: 'http://192.168.0.113:8010/',
    production: 'http://api.0state.com/',
    token: 'ae33d6face3d0a8882059e2583725b786c2c4fb96e7c5805b4cdb0590292edfc'
  });
};

