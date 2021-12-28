var express = require('express');
var Book = require('../models').Book;
var router = express.Router();
var jwt = require('jsonwebtoken');
var ejwt = require('express-jwt');
var path = require("path");
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];


var jwtCheck = ejwt({
    secret: config.secretKey,
    algorithms: ['RS256']
});


var checkIDInput = function(req, res, next) {

    if (isNaN(req.params.id)) {
        res.status(400).json('Invalid ID supplied');
    } else {
        next();
    }
};
var checkIDExist = function(req, res, next) {
    Book.count({ where: { id: req.params.id } }).then(count => {
        if (count != 0) {
            next();
        } else {
            res.status(400).json('Book not found');
        }
    });
};

router.use('/', jwtCheck, function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        return res.status(403).send({ status: false, data: {}, message: "invalid token provided." });
    }
});

router.get('/', function(req, res) {
    //console.log('Getting all books');
    Book.findAll().then(book => {
        res.status(200).json(book);
    });
});

router.post('/', function(req, res) {
    Book.create({
        title: req.body.title,
        author: req.body.author,
        category: req.body.category
    }).then(book => {
        /*console.log(book.get({
            plain: true
        }));*/
        res.status(200).json(book);
    }).error(err => {
        res.status(405).json('Error has occured');
    });
});

router.get('/:id', [checkIDInput, checkIDExist], function(req, res) {
    //console.log('Get book by id');
    Book.findById(req.params.id).then(book => {
        //console.log(book);
        res.status(200).json(book);
    });
});

router.put('/:id', [checkIDInput, checkIDExist], function(req, res) {
    //console.log('Update book by id');
    Book.update({
        title: req.body.title,
        author: req.body.author,
        category: req.body.category
    }, {
        where: { id: req.params.id }
    }).then(result => {
        res.status(200).json(result);
    });
});

router.delete('/:id', [checkIDInput, checkIDExist], function(req, res) {
    //console.log('Delete book by id');
    Book.destroy({
        where: { id: req.params.id }
    }).then(result => {
        res.status(200).json(result);
    });
});

module.exports = router;