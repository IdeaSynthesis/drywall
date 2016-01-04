'use strict';

// load any environment files
if('ENV_FILE' in process.env){
    require('node-env-file')(process.env.ENV_FILE);
}

//dependencies
var express = require('express'),
cookieParser = require('cookie-parser'),
bodyParser = require('body-parser'),
session = require('express-session'),
http = require('http'),
path = require('path'),
passport = require('passport'),
helmet = require('helmet'),
csrf = require('csurf'),
pgp = require('pg-promise')({ promiseLib: require('bluebird') });

var port = parseInt(process.env.PORT) || 8000;

//create express app
var app = express();

//setup the web server
app.server = http.createServer(app);

// setup ORM
app.db = require("./orm/index")(pgp(process.env.DATABASE_URL));

//config data models
require('./models')(app, app.db);

//settings
app.disable('x-powered-by');
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var session_options = {
    resave: true,
    saveUninitialized: true,
    secret: process.env.CRYPTO_KEY
};

if('SESSION_STORE' in process.env) session_options['store'] = require(process.env.SESSION_STORE)(session);
//mongoStore = require('connect-mongo')(session),store: new mongoStore({ url: config.mongodb.uri })

//middleware
app.use(require('morgan')('dev'));
app.use(require('compression')());
app.use(require('serve-static')(path.join(__dirname, 'public')));
app.use(require('method-override')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.CRYPTO_KEY));
app.use(session(session_options));
app.use(passport.initialize());
app.use(passport.session());
app.use(csrf({ cookie: { signed: true } }));
helmet(app);

//response locals
app.use(function(req, res, next) {
  res.cookie('_csrfToken', req.csrfToken());
  res.locals.user = {};
  res.locals.user.defaultReturnUrl = req.user && req.user.defaultReturnUrl();
  res.locals.user.username = req.user && req.user.username;
  next();
});

//global locals
app.locals.projectName = process.env.PROJECT_NAME;
app.locals.copyrightYear = new Date().getFullYear();
app.locals.copyrightName = process.env.COMPANY_NAME;
app.locals.cacheBreaker = 'br34k-01';

//setup passport
require('./passport')(app, passport);

//setup routes
require('./routes')(app, passport);

//custom (friendly) error handler
app.use(require('./views/http/index').http500);

//setup utilities
app.utility = {};
app.utility.sendmail = require('./util/sendmail');
app.utility.slugify = require('./util/slugify');
app.utility.workflow = require('./util/workflow');

//listen up
app.server.listen(port, function(){
  //and... we're live
  console.log('Server is running on port ' + port);
});

// see if we're explicitly asked to load up a shell
if('OPEN_REPL' in process.env){
    var repl = require('repl');
    var r = repl.start({ prompt: "Drywall> ", useColors: true, terminal: true, useGlobal: false, ignoreUndefined: true });
    r.context.app = app;
}
