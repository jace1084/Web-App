var express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
//use sendgrid
var sgMail = require("@sendgrid/mail");
var keys = require("../key");
sgMail.setApiKey(keys.sendgrid);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(methodOverride('_method'));

var connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'password',
  database: 'crypto_db'
});

connection.connect(function(err){
  if(!err) {
      console.log("Database is connected ... nn");
  } else {
      console.log("Error connecting database ... nn");
  }
  });

  router.post("/register", function(req,res){
    // console.log("req",req.body);
    // var today = new Date();
    var users={
      // "first_name":req.body.first_name,
      // "last_name":req.body.last_name,
      "username": req.body.username,
      "email":req.body.email,
      "password":req.body.password,
      // "created":today,
      // "modified":today
    }
    connection.query('INSERT INTO users SET ?',users, function (error, results, fields, next) {
    if (error) {
      console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      console.log('The solution is: ', results);
      // Redirect to next page (first user page).
      res.send({
        "code":200,
        "success":"user registered sucessfully"
          });
    }
    });
  });
  // router.post('/login',login.login)
  // app.use('/api', router);

// router.post('/SignUp', function(req, res) {
//   // Get sent data.
//   var user = req.body;
//   // Do a MySQL query.
//   connection.query('INSERT INTO users SET ?',
//   { 
//   username: user.userName,
//   email: user.email,
//   password: user.password,
//   cyrptoProfil: user.cyrptoProfil,
//   hasAgreed: user.hasAgreed
//   },

//   function(err, result) {
//     // Neat!
//   });
//   res.end('Success');
// });








// router.post('/registered', function(req, res) {
//   // Get sent data.
//   // var user = req.body;
//   // Do a MySQL query.
//   connection.query('INSERT INTO users SET ?',req.body.username, req.body.email, req.body.password, 
//   function(err, result) {
//     if (error) throw error;
//     res.json(result)
    
//   });
//   res.redirect('/');
// });

/*
Sendgrid Example. Wait for singup to be completed before this can be integrated
const msg = {
  to: 'simonnguyen3054@gmail.com',
  from: 'simon@acceptmycrypto.com',
  subject: 'Email Testing: Generated by our server',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);
*/

module.exports = router;