/**
 * Created by perry on 15/9/26.
 */

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multipart = require('connect-multiparty');
var session = require('express-session');
var logger = require('express-logger');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);

var port = process.env.PORT || 3030;
var app = express();

var dbUrl = 'mongodb://localhost/movie';
mongoose.connect(dbUrl);

app.set('views', './app/views/pages');
app.set('view engine', 'jade');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser());
app.use(cookieParser());
app.use(multipart());
app.use(session({
  secret: 'movie'
  , store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}));

if ('development' === app.get("env")){
  //能够在browser端打出错误
  app.set('showStackError', true);
  app.use(logger({path:'logs.txt'}));
  app.locals.pretty = true;
  mongoose.set('debug', true);
}

require('./config/routes')(app);

app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');
app.listen(port);

console.log('movie started on port ' + port);



