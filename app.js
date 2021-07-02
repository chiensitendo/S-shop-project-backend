var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var cookieParser = require('cookie-parser');
const { promisifyAll } = require('bluebird');

const redis = require("redis");

const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { getProvinceList } = require('./services/master-services');
const Redis = require('./models/Redis');

var app = express();

promisifyAll(redis);

const redisClient = redis.createClient({
  host: 'redis-10794.c275.us-east-1-4.ec2.cloud.redislabs.com',
  port: 10794,
  password: 'nMmAI8dGg45CyLOga0LsEi8dduhwzqKW'
});

redisClient.on("error", function(error) {
  console.error(error);
});

redisClient.on("ready", function(error) {
  console.error("Redis Cache is ready!");
});



var corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3000/'],
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  preflightContinue: true,
  optionsSuccessStatus: 200
}


app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);

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

mongoose.connect("mongodb+srv://minhsang:Sang306244@cluster0.7ervw.mongodb.net/s-shop", 
{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.connection.on('error', (err) => {
    console.log(`Mongoose connection error: ${err}`);
    process.exit(1);
});
mongoose.connection.once('open', (err, resp) => {
    console.log("Mongo Database is connected!");
    getProvinceList().then(res => {
    redisClient.setAsync("provinces", JSON.stringify(res));
    console.log("Cache: Provinces List: Fetched!")  
    }).catch(err => console.log(err));
});

module.exports = mongoose.connection;
module.exports = new Redis(redisClient); 

module.exports = app;


