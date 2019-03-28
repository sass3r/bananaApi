var express = require('express'),
    app = express(),
    port = 8085
    mongoose = require('mongoose'),
    User = require('./api/models/userModel'),
    Session = require('./api/models/sessionModel'),
    bodyParser = require('body-parser'),
    jwt = require('express-jwt');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/BananaChain');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(jwt({
    secret: 'h4pp1 h4ck1ng',
    credentialsRequired: false
}));

var routes = require('./api/routes/userRoutes');
routes(app,jwt);

app.listen(port,'0.0.0.0');
console.log('ycoins RESTful API server started on: ' + port);
