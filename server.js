const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const config = require('./config');
const app = express();
const port = process.env.PORT || '3000';
const hbs = require('hbs');
const aws = require('aws-sdk');
const methodOverride = require('method-override')
const db = require('./app/models');

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'hbs');


// cookie, logger, body-parser, method-override
app.use(cookieParser());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(methodOverride("_method"));

//Passport
app.use(passport.initialize());
app.use(require('./config/passport').serializeUser);

//aws confidential
aws.config.loadFromPath(path.join(config.root, '/config/aws-config.json'));


// static files. 
app.use('/public', express.static(path.join(__dirname, 'public')));

// routes
// app.all('/', )
app.use('/', require('./app/routes/html'));
app.use('/api/image', require('./app/routes/image'));
app.use('/api/user', require('./app/routes/user'));
app.use('/api/skill', require('./app/routes/skill'));
app.use('/api/project', require('./app/routes/project'));
app.use('/auth', require('./app/routes/auth'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


/**
 * db sync and listen
 */
db.sequelize.sync({}).then(() => {
  app.listen(port, () => console.log("Server listening on " + port));
});
app.on('error', onError);
app.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
}

module.exports = app;
