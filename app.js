var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('./config/cors');
const passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var gameRouter = require('./routes/game');
var categoryRouter = require('./routes/category');
var shortlinkRouter = require('./routes/shortlink');
var cartRouter = require('./routes/cart');
var discountRouter = require('./routes/discount');
var historyRouter = require('./routes/history');
var buyRouter = require('./routes/buy');
var historyChatRouter = require('./routes/historychat');
var payOsRouter = require('./routes/payos')
const session = require('express-session');
require('./config/oauthConfig');

var app = express();
var dotenv = require('dotenv');
dotenv.config();
// Connect to database
const connectDB = require('./config/database');
connectDB();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
// app.listen(3636, () => {
//   console.log('Server is running on port 3636');
// });
require('./jobs');
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/games', gameRouter);
app.use('/api/categories', categoryRouter);
app.use('/v', shortlinkRouter);
app.use('/api/cart', cartRouter);
app.use('/api/discount', discountRouter);
app.use('/api/history', historyRouter);
app.use('/api/buy', buyRouter);
app.use('/api/historychat', historyChatRouter);
app.use('/api/payos', payOsRouter)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.render('error');
});

module.exports = app;
