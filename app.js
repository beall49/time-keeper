let express      = require('express');
let path         = require('path');
let favicon      = require('serve-favicon');
let logger       = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser   = require('body-parser');

let index = require('./routes/index');
let api   = require('./routes/api');
let cert  = require('./routes/cert');
let app   = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.all('*', ensureSecure);
app.use('/', index);
app.use('/api/', api);
app.use('/.well-known/acme-challenge/', cert);


// catch 404 and forward to error handler
app.use(function(req, res, next){
    let err    = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next){
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error   = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

function ensureSecure(req, res, next){
    if (req.hostname == "localhost") return next();
    if (req.headers["x-forwarded-proto"] === "https") {
        // OK, continue
        return next();
    }
    // handle port numbers if you need non defaults
    // res.redirect('https://' + req.host + req.url); // express 3.x
    res.redirect('https://' + req.hostname + req.url); // express 4.x
}

module.exports = app;
