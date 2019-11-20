var path = require('path');
var express = require('express');
var expressLayouts = require('..');
var mysql = require('mysql');
var http = require('http');
var url = require('url');

var app = express();
var router = express.Router();
// --------------------------passport-----------------------------------
var flash             = require('connect-flash');
var crypto            = require('crypto');
var passport          = require('passport');
var LocalStrategy     = require('passport-local').Strategy;
// var connection        = require('./lib/dbconn');
var sess              = require('express-session');
var Store             = require('express-session').Store;
var BetterMemoryStore = require(__dirname + '/memory');
var BetterMemoryStore = require('session-memory-store')(sess);
// --------------------------passport-----------------------------------


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

//Express sesion
var store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true });
app.use(sess({
   name: 'JSESSION',
   secret: 'MYSECRETISVERYSECRET',
   store:  store,
   resave: true,
   saveUninitialized: true
}));
// Passport

passport.use('local', new LocalStrategy({

  usernameField: 'username',

  passwordField: 'password',

  passReqToCallback: true //passback entire req to call back
} , function (req, username, password, done){


      if(!username || !password ) { return done(null, false, req.flash('message','All fields are required.')); }

      var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';

      connection.query("select * from test_profile where username = ?", [username], function(err, rows){

          console.log(err); console.log(rows);

        if (err) return done(req.flash('message',err));

        if(!rows.length){ return done(null, false, req.flash('message','Invalid username or password.')); }

        salt = salt+''+password;

        var encPassword = crypto.createHash('sha1').update(salt).digest('hex');


        var dbPassword  = rows[0].password;

        if(!(dbPassword == encPassword)){

            return done(null, false, req.flash('message','Invalid username or password.'));

         }

        return done(null, rows[0]);

      });

    }

));

// Serialize and deserialize user information

passport.serializeUser(function(user, done){

  done(null, user.id);

});

passport.deserializeUser(function(id, done){

  connection.query("select * from tbl_users where id = "+ id, function (err, rows){

      done(err, rows[0]);

  });

});

//Signin route for GET method

app.get('/signin', function(req, res){
  res.render('login/index',{'message' :req.flash('message')});
});
//Signin route for POST method to authenticate requests

app.post("/signin", passport.authenticate('local', {

  successRedirect: '/profile',

  failureRedirect: '/signin',

  failureFlash: true

}), function(req, res, info){

  res.render('login/index',{'message' :req.flash('message')});

});

//Protect routes with isAutehticated


function isAuthenticated(req, res, next) {

  if (req.isAuthenticated())

    return next();

  res.redirect('/signin');

}

//Login

app.get('/login', function (req, res) {

  res.render('login', {

  });

});

app.get('/', function (req, res) {

  res.locals = {
    title: 'Test',
  };

  res.render('index', {

  });

});

app.get('/add', function (req, res) {

  res.locals = {
    title: 'Test',
  };

  res.render('add', {

  });

});

app.post('/add', function (req, res) {

  res.locals = {
    title: 'Test',
  };

  var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test'
  });

  conn.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });

  var fname = req.body.fname,
  username = req.body.username,  
  password = req.body.password, 
  lname = req.body.lname, 
  age = req.body.age, 
  tel = req.body.tel;

  var sql = "INSERT INTO test_profile (username,password,fname, lname, age, tel) VALUES ('" + username + "','" + password + "','" + fname + "', '" + lname + "', '" + age + "', '" + tel + "')";
  conn.query(sql, [username,password,fname, lname, age, tel], function (err, data) {
    if (err) {
      console.log("Error inserted into db");
      res.redirect('/show');
    } else {
      console.log("Successfully inserted into db");
      res.redirect('/show');
    }
  });
});

app.get('/show', function (req, res) {

  var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test'
  });

  var sql = "SELECT * FROM test_profile";
  conn.query(sql, function (err, result) {
    res.render('show', { result: result });
  });
});

app.get('/delete', function (req, res) {
  var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
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
      res.redirect('show');
    });
  });

});

app.get('/edit', function (req, res) {
  var conn = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: 'root',
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
      
      var username = data.username;
      var password = data.password;
      var fname = data.fname;
      var lname = data.lname;
      var age = data.age;
      var tel = data.tel;
      res.render('edit', { username: username,password: password,fname: fname, lname: lname, age: age, tel: tel, id: id });
    });
  });
});

app.get('/update', function (req, res) {

  var fname = req.query.fname, 
  username = req.body.username,  
  password = req.body.password,
  lname = req.query.lname, 
  age = req.query.age, 
  tel = req.query.tel;

  var conn = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test'
  });

  conn.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var id = req.query.update;
    console.log("ID is = " + id);
    var sql = "UPDATE test_profile SET username = '" + username + "',password = '" + password + "',fname = '" + fname + "', lname = '" + lname + "', age = '" + age + "', tel = '" + tel + "' WHERE id = '" + id + "'";
    conn.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
      res.redirect('show');
    });
  });

});

var port = 3000;
app.listen(port, function () {
  console.log('Listening on http://localhost:%s/', port);
});

module.exports = router;