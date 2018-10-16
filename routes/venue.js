var express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('express-flash')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(flash());

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

//venues list
router.get('/venues', function(req, res) {
  connection.query(
    'SELECT venues.venue_name, crypto_metadata.crypto_name FROM cryptos_venues LEFT JOIN venues ON venues.id = cryptos_venues.venue_id LEFT JOIN crypto_metadata ON crypto_metadata.id = cryptos_venues.crypto_id',
    function(err, data, fields) {
      res.render('pages/venues', {
        venues: data
      });
    }
  );
});

router.post('/venues/create', function(req, res) {
  var query = connection.query(
    'INSERT INTO userInput SET ?',
    req.body,
    function(err, response) {
      req.flash('info', 'Thank you for your Submit. Once verified, we will email you the result.');
      res.redirect('/');
    }
  );
});

//api
router.get('/api/venues_cryptos', function(req, res) {
  connection.query(
    'SELECT venues.venue_name, venues.venue_description, crypto_metadata.crypto_name FROM cryptos_venues LEFT JOIN venues ON venues.id = cryptos_venues.venue_id LEFT JOIN crypto_metadata ON crypto_metadata.id = cryptos_venues.crypto_id',
    function(error, results, fields) {
      if (error) throw error;

      let venue = '';
      let crypto = '';
      let cryptocurrencies = [];
      let newObj = {};

      results.map((venueObj) => {

        if (venueObj.venue_name !== venue) {
          venue = venueObj.venue_name;
          crypto = venueObj.crypto_name;

          //when it's a new venue_name, empty the cryptocurrencies array
          cryptocurrencies = [];
          cryptocurrencies.push(crypto);
          newObj[venueObj.venue_name] = cryptocurrencies;

        } else {
          crypto = venueObj.crypto_name;
          cryptocurrencies.push(crypto);
          newObj[venueObj.venue_name] = cryptocurrencies;
        }

        return newObj;
      });

      res.json(newObj);
    }
  );
});

module.exports = router;