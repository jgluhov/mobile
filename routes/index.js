var express = require('express');
var router = express.Router();

router.get('/templates/:name', function(req, res) {
  var name = req.params.name;
  res.render('../templates/' + name);
});

router.get('/', function(req, res) {
  res.render('layout');
});

router.get('*', function(req, res) {
  res.render('layout');
});

module.exports = router;