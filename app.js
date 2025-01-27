var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var handlebars = require('handlebars')

var hbs = require('express-handlebars')

var fileUpload = require('express-fileupload')

var db=require('./config/connection')
var session = require('express-session')
var mongodbStore = require('connect-mongodb-session')(session)

var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials'}))

var store = new mongodbStore({
  uri:'mongodb://localhost:27017/connect_mongodb_session_test',
  databaseName:'shopping',
  collection:'mySession'
})
app.use(function(req, res, next) { 
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
   next();
 });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload())

app.use(session({secret:'key',
store:store,

cookie:{}}))

db.connect((err)=>{
  if(err)
  console.log('connection error'+err)
  else
  console.log("Database")
})

handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});

app.use('/', usersRouter);
app.use('/admin', adminRouter);
 


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
