var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var cors = require('cors');
var session = require('express-session');
var routes = require('./routes/index');
var placerouter = require('./routes/placeroutes');
var busrouter = require('./routes/busrouteroutes');
var busstation = require('./routes/busstationroutes');
var domain = require('express-domain-middleware');
var fs = require('fs');

var con = require('./config.js');
var cluster = require('cluster');
var app = express();

//mail
var send_mail = require('./utility/sendErrormail.js');

//logging
var logger = require("./utility/winstonlog.js");

logger.debug("express logging start");

/*var numCPUs = require('os').cpus().length;*/

/* cpu clustering. numCpus count core number. 1 master core and 4 work core. so not single thread but multi thread.
 * multi thread are good at speed*/

// view engine setup

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(favicon());
app.use(require('morgan')({ "stream": logger.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
    name: con.session.name,
    secret: con.session.secret,
    proxy: true,
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(domain);


/* placeSearch restful api. this setting go to routes/placeroutes.js
 and look up request url. info: search route using x, y or search real time data*/

app.use('/', placerouter);


/* routeSearch restful api. this setting go to routes/busrouteroutes.js
 and look up request url. info : route specific information like routeid or routename ...*/

app.use('/', busrouter);


/* stationSearch restful api. this setting go to routes/busstationroutes.js
 and look up request url. info: station specific information like station name or station id*/

app.use('/', busstation);


/* home directory. index page router */

//app.use('/', routes);
app.use('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

/// catch 404 and forward to error handler
app.use(function () {
    var err = new Error('request rest api error');
    err.status = 404;
    throw err;
});

//real error handler
app.use(function errorHandler(err, req, res, next) {

    console.log('error on request %d | %s | %s | %d', process.domain.id, req.method, req.url, err.status);
    console.log('-------------------------------------------------------');
    console.log(err.stack);
    console.log('-------------------------------------------------------');
    err.message = err.status == 500 ? 'Something bad happened. :(' : err.message;
    console.log('-------------------------------------------------------');

    send_mail.sendEmail(errordata);
    res.send(err.status, err.message);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
};

http.createServer(app).listen(app.get('port'), function () {
    console.log('process id = ' + process.pid);
    console.log('bus server listening on port ' + app.get('port'));
});

module.exports = app;