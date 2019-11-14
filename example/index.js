var path = require('path');
var express = require('express');
var expressLayouts = require('..');
var mysql = require('mysql');
var http = require('http');

var app = express();
var router = express.Router();

var url = require('url');
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('MehdiFilban solved this problem\nYour Header is set NOW\nGOOD LUCK...');
}).listen(port, () => {
  console.log('your app is started');
});

//BodyParser modules
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout extractScripts', true)
app.set('layout extractStyles', true)

app.use(expressLayouts);
app.use(express.static('public'));

app.get('/', function (req, res) {

  res.locals = {
    title: 'Test',
    fname: 'fname',
    lname: 'lname',
  };
  var conn = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
  });

  conn.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });

  res.render('view', {

  });

});

app.post('/a', function (req, res) {

  var conn = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
  });

  conn.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });

  var fname = req.body.fname,
    lname = req.body.lname,
    age = req.body.age,
    tel = req.body.tel;

  var sql = "INSERT INTO test_profile (fname, lname, age, tel) VALUES ('" + fname + "', '" + lname + "', '" + age + "', '" + tel + "')";
  conn.query(sql, [fname, lname, age, tel], function (err, data) {
    if (err) {
      console.log("Error inserted into db");
    } else {
      console.log("Successfully inserted into db");
    }
  });

  var sql = "SELECT * FROM test_profile";
  conn.query(sql, function (err, result) {
    res.render('a', { result: result });
  });
});

app.get('/delete', function (req, res) {
  var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
  });
  conn.connect(function (err, result) {
    if (err) throw err;
    console.log(result);
    var id = req.query.id;
    console.log("ID is = " + id);
    var sql = "DELETE FROM test_profile WHERE id = '" + id + "'";
    conn.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Number of records deleted"+ result.affectedRows);
      var sql = "SELECT * FROM test_profile";
      conn.query(sql, function (err, result) {
        res.render('a', { result: result });
      });
    });
  });

});

var port = 3000;
app.listen(port, function () {
  console.log('Listening on http://localhost:%s/', port);
});