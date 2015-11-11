var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('layout');
});

router.get('/templates/:name', function(req, res) {
  var name = req.params.name;
  res.render('../templates/' + name);
});

module.exports = router;