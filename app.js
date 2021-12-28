var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sqlite = require('sqlite3');
var env = require('dotenv').config();
var port = process.env.PORT || 3000;

// models
var models = require("./models");

// routes
var books = require('./routes/books');
var users = require('./routes/users');

//Sync Database
models.sequelize.sync().then(function() {
    console.log('connected to sqlite')
}).catch(function(err) {
    console.log(err)
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// register routes
app.use('/book', books);
app.use('/', users);
// index path
app.get('/', function(req, res) {
    console.log('app listening on port: ' + port);
    res.send('express-crud nodejs sqlite')
});

app.listen(port, function() {
    console.log('app listening on port: ' + port);
});

module.exports = app;