var path = require('path');
var express = require('express');
var expressLayouts = require('..');
var mysql = require('mysql');
var http = require('http');
var url = require('url');
var conn = require('./connection');

var app = express();
var router = express.Router();


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

  res.render('view', {

  });

});

app.get('/a', function (req, res) {

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
      console.log("Number of records deleted" + result.affectedRows);
      res.redirect('a');
    });
  });

});

app.get('/b', function (req, res) {
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
  var id = req.query.id;
  var sql = "SELECT * FROM test_profile WHERE id = '" + id + "'";
  conn.query(sql, function (err, result) {
    result.forEach(function (data) {
      var fname = data.fname;
      var lname = data.lname;
      var age = data.age;
      var tel = data.tel;
      res.render('b', { fname: fname, lname: lname, age: age, tel: tel, id: id });
    });
  });
});

app.get('/update', function (req, res) {

  var fname = req.query.fname, 
  lname = req.query.lname, 
  age = req.query.age, 
  tel = req.query.tel;

  var conn = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
  });

  conn.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var id = req.query.update;
    console.log("ID is = " + id);
    var sql = "UPDATE test_profile SET fname = '" + fname + "', lname = '" + lname + "', age = '" + age + "', tel = '" + tel + "' WHERE id = '" + id + "'";
    conn.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
      res.redirect('a');
    });
  });

});

var port = 3000;
app.listen(port, function () {
  console.log('Listening on http://localhost:%s/', port);
});