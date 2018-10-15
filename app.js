var express = require('express');  
var path = require('path');  
var favicon = require('serve-favicon');  
var logger = require('morgan');  
var cookieParser = require('cookie-parser');  
var bodyParser = require('body-parser');

var routes = require('./routes/index');  
var users = require('./routes/users');

var passport = require('passport');  
var LocalStrategy = require('passport-local').Strategy;  
var mongoose = require('mongoose');  
var flash = require('connect-flash');  
var session = require('express-session');

var configDB = require('./configs/db.js');
mongoose.connect(configDB.url);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));  
app.set('view engine', 'ejs');

app.use(logger('dev'));  
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(cookieParser());  
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'shhsecret' }));  
app.use(passport.initialize());  
app.use(passport.session());  
app.use(flash());

app.use('/', routes);  
app.use('/users', users);

require('./configs/passport')(passport);

app.use(function(req, res, next) {  
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {  
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}
app.use(function(err, req, res, next) {  
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

app.listen(3000, function(req, res){
	console.log('server running on 3000');
});  
module.exports = app;  