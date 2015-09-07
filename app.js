require('dotenv').load();

var express = require('express');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var mongoose = require('mongoose');
var passport = require('passport'); 
var LocalStrategy = require('passport-local').Strategy; 
var routes = require('./routes/index');

//||||||||||||||||||||||||||--
// O_AUTH
//||||||||||||||||||||||||||--
var Facebook = require('./config/facebook');
var Twitter  = require('./config/twitter');

var app = express();
// load mongoose and connect to a database

app.engine('html', require('ejs').renderFile);
//||||||||||||||||||||||||||--
// CREATE MONGO DB
//||||||||||||||||||||||||||--
var mongoURI = 'mongodb://localhost/fitgeneration';
if (process.env.NODE_ENV === 'production') {
  mongoURI = process.env.MONGOLAB_URI
};

//||||||||||||||||||||||||||--
// CONNECT TO OUR MONGO DATABASE
//||||||||||||||||||||||||||--
mongoose.connect(mongoURI);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
/*app.set('view engine', 'ejs');*/
app.engine('html', require('ejs').renderFile); app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT || 3000);


// auth middleware
app.use(require('express-session')({
    secret: 'keyboard cat', 
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize()); 
app.use(passport.session()); 

app.locals.title = 'fitGeneration';


var User = require('./models/User');

app.use('/', routes);


var User = require('./models/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.listen();
console.log('3000 is the magic port');



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
