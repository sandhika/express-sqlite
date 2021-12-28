var express = require('express');
var User = require('../models').User;
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


function createToken(user) {
    return jwt.sign({ email: user.email },
        config.secretKey, {
            expiresIn: '24h'
        }
    );
}

//check parameter ID
var checkParamID = function(req, res, next) {

    if (isNaN(req.params.id)) {
        res.status(400).json('Invalid ID supplied');
    } else {
        next();
    }
};

//check ID Exist
var checkIDExist = function(req, res, next) {
    User.count({ where: { id: req.params.id } }).then(count => {
        if (count != 0) {
            next();
        } else {
            res.status(400).json('User not found');
        }
    });
};


router.use('/', jwtCheck, function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        return res.status(403).send({ status: false, data: {}, message: "invalid token provided." });
    }
});

router.get('/profile', function(req, res) {
    const decoded = jwt.decode(req.headers.authorization.split(' ')[1])
    User.findAll({
        where: { email: decoded.email }
    }).then(user => {
        res.status(200).json(user);
    });
});

router.post('/register', function(req, res) {
    User.create({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password

    }).then(user => {
        res.status(200).json(user);
    }).error(err => {
        res.status(405).json('Error has occured');
    });
});

router.post('/login', function(req, res) {
    User.find({
        where: { email: req.body.email }
    }).then(result => {
        if (result) {
            if (result.password == req.body.password) {
                res.status(200).json({ status: true, data: { id_token: createToken(result), email: req.body.email }, message: "" });
            } else {
                res.status(200).json({ status: false, data: { id_token: "", email: "" }, message: "Invalid Email/Password" });
            }
        } else {
            res.status(200).json({ status: false, data: { id_token: "", email: "" }, message: "Invalid Email/Password" });
        }

    }).error(err => {
        res.status(405).json('Error has occured');
    });;
});

router.delete('/:id', [checkParamID, checkIDExist], function(req, res) {
    User.destroy({
        where: { id: req.params.id }
    }).then(result => {
        res.status(200).json(result);
    });
});

module.exports = router;