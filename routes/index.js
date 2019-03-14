var express = require('express');
var router = express.Router();
var User = require('../models/users');
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {

//   try {
//     var jwtString = req.cookies.Authorization.split(" ");
//     var profile = verifyJwt(jwtString[1]);
//     if (profile) {
          res.render('index', { title: 'Express' });
//     }
// }catch (err) {
//         res.json({
//             "status": "error",
//             "body": [
//                 "You are not logged in."
//             ]
//         });
//     }

});


/*
 Verifies a JWT
 */
function verifyJwt(jwtString) {

    var value = jwt.verify(jwtString, 'CSIsTheWorst');
    return value;
}




router.get('/login', function(req, res, next) {
    res.render('login');
});

router.get('/register', function(req, res, next) {
    res.render('register');
});

router.get('/home', function(req, res, next) {
    res.render('home');
});

router.get('/friendlist', function(req, res, next) {
    res.render('friendlist');
});

router.get('/homeNoLogin', function(req, res, next) {
    res.render('homeNoLogin');
});

module.exports = router;
