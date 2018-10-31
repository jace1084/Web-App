var express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

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

//cryptos list
router.get('/', function(req, res) {
  res.redirect('/cryptos');
});

// router.get('/cryptos', function(req, res) {
//   connection.query(
//     'SELECT crypto_id, count(venue_id) as total FROM cryptos_venues GROUP BY crypto_id',
//     function(err, venues_count, fields) {
//       for (var i in venues_count) {
//         connection.query(
//           'UPDATE crypto_metadata SET ? WHERE ?',
//           [
//             { venues_count: venues_count[i].total },
//             { id: venues_count[i].crypto_id }
//           ],
//           function(err, res) {
//             if (err) {
//               console.log(err);
//             }
//           }
//         );
//       }

//       connection.query(
//         'SELECT * FROM crypto_metadata LEFT JOIN crypto_info ON crypto_metadata.crypto_name = crypto_info.crypto_metadata_name ORDER by venues_count DESC',
//         function(err, data, fields) {
//           res.render('pages/index', {
//             cryptos: data
//           });
//         }
//       );
//     }
//   );
// });

//crypto detail
router.get('/cryptos/:crypto', function(req, res) {
  res.render('pages/crypto', {
    crypto: req.params.crypto
  });
});

//crypto search
router.post('/cryptos/search', function(req, res) {
  connection.query(
    'SELECT * FROM crypto_metadata LEFT JOIN crypto_info ON crypto_metadata.crypto_name = crypto_info.crypto_metadata_name WHERE ?',
    req.body,
    function(err, data, fields) {
      if (data === undefined || data.length == 0) {
        res.redirect('/');
      } else {
        res.render('pages/index', {
          cryptos: data
        });
      }
    }
  );
});


// my code from this point down.  not too sure what's above this*****************************

router.get('/community', function(req, res) {
    connection.query(
        'SELECT * FROM crypto_info',
        (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log(data);
                res.json({allCryptos:data});
            }
        }
    );
});







// this function joins crypto_comments to parents_children to users, gets relevant columns back, then feeds it all to assembleComments()
getAllComments = (res, crypto_id) => {
    connection.query(
        `SELECT c.id AS id, c.user_id AS user_id, c.crypto_id AS crypto_id, c.body AS body, c.date_commented AS date_commented, c.comment_status AS comment_status, c.points AS points, p.comment_parent_id AS comment_parent_id, u.username AS username FROM crypto_comments c LEFT JOIN parents_children p ON c.id = p.comment_child_id LEFT JOIN users u ON c.user_id = u.id WHERE crypto_id=${crypto_id} ORDER BY date_commented`,
        (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log(data);
                let assembledData = assembleComments(data);
                res.json(assembledData);
            }
        }
    )
}

//function to take query result from mysql as input and turn it into data that can be directly set into state when returned
assembleComments = (data) => {
    let allComments = [];
    let id, user_id, crypto_id, body, date_commented, comment_status, points, username, x;
    for (x of data) {//cycle thru all returned comments
        ({id, user_id, crypto_id, body, date_commented, comment_status, points, username} = x);//destructures x
        if (x.comment_parent_id==null) {//if comment does not have parent id, this comment is a parent itself, therefore append info from x to allComments
            allComments = [...allComments,{id, user_id, crypto_id, body, date_commented, comment_status, points, username, children:[]}];
        } else {//if comment has parent id, this comment is a child
            allComments = allComments.map(y => {
                if (y.id===x.comment_parent_id){//find the parent of the child
                    return ({
                        id:y.id,//every line here except for children is the original data of the parent
                        user_id:y.user_id,
                        crypto_id:y.crypto_id,
                        body:y.body,
                        date_commented:y.date_commented,
                        comment_status:y.comment_status,
                        points:y.points,
                        username:y.username,
                        children:[...y.children,{id, user_id, crypto_id, body, date_commented, comment_status, points, username, children:[]}]
                        //child data is appended into parent's children array
                    });
                } else {
                    return y;
                }
            })
        }
    }
    console.log("allComments156");
    console.log(allComments);
    return ({allComments});
    
}

//this function converts new lines from the fake text box into line breaks, and urls into a tags.
convertURL = (str) => {
    let res = '';
    let res2 = '';
    let arr = str.split('\n');
    res = arr.map(x => {
        let arr2 = x.split(' ');
        res2 = arr2.map(y => {
            if (y.includes('http')){
                return `<a href='${y}' target='_blank'>${y}</a>`;
            } else {
                return y;
            }
        })
        return res2.join(' ')
    })
    return res.join('<br/>');
}

router.get('/forum/:crypto_id', function (req,res) {
    console.log("req.params.crypto_id ");
    console.log(req);
    getAllComments(res, req.params.crypto_id)
})

router.post('/crypto/submit-comment', function (req, res){
    console.log("req.body");
    console.log(req.body);
    let user_id, crypto_id, body, comment_parent_id;
    ({user_id, crypto_id, body, comment_parent_id} = req.body);
    body = convertURL(body);
    connection.query(
        'INSERT INTO crypto_comments SET ?',
        [{user_id, crypto_id, body}],
        function (err, insertData){
            if (err){
                console.log("error during submit query");
                console.log(err);
            } else {
                console.log("data from submit query");
                console.log(insertData);
                if(comment_parent_id==0){//this means the submitted comment is a parent comment, can go straight to getAllComments
                    getAllComments(res, crypto_id)
                } else {//this means the submitted comment is a child comment, so must also update parents_children table
                    connection.query(
                        'INSERT INTO parents_children SET ?',
                        [{comment_parent_id, comment_child_id:insertData.insertId}],//insertData contains the id of the comment newly added into crypto_comments
                        function (err, insertData2){
                            if (err){
                                console.log("error during submit query 2");
                                console.log(err);
                            } else {
                                console.log("data from submit query 2");
                                console.log(insertData2);
                                getAllComments(res, crypto_id)
                            }
                        }
                    )
                }
            }
        }
    )
})

router.post('/crypto/delete-comment', function (req, res){
    console.log("req.body");
    console.log(req.body);
    //does not actually delete comment, but changes the comment state to deleted
    connection.query(
        'UPDATE crypto_comments SET ? WHERE ?',
        [{comment_status: "deleted", points:0},{id:req.body.id}],
        function (err, delete1){
            if (err){
                console.log("error during delete");
                console.log(err);
            } else {
                getAllComments(res, crypto_id)
            }
        }
    )
})

module.exports = router;