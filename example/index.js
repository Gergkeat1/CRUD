var path = require('path');
var express = require('express');
var expressLayouts = require('..');

var app = express();

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout extractScripts', true)
app.set('layout extractStyles', true)

app.use(expressLayouts);

app.get('/', function(req, res) {
  res.locals = {
    title: 'Test',
    fname: 'fname',
    lname: 'lname',    
  };
  res.render('view');
});

app.post('/a', function(req, res) {
  var fname = req.body.fname,
      lname = req.body.lname ;
  res.render('a', {
    title: 'Test',
    fname: req.body.fname,
    lname: req.body.lname,
  });
});

app.get('/back', function(req, res) {
  res.render('view');
});



var port = 3000;
app.listen(port, function() {
  console.log('Listening on http://localhost:%s/', port);
});