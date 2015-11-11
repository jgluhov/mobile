var express = require('express'),
    jade = require('jade'),
    path = require('path'),
    routes = require('./routes');

var app = express();

app.set('view engine', 'jade');
app.set('views', path.join(__dirname,'templates'));

app.use(express.static(path.join(__dirname, 'assets')));

app.listen(3000);