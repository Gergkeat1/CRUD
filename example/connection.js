var mysql = require('mysql');

var conn = mysql.createConnection({
    supportBigNumbers: true,
    bigNumberStrings: true,
  
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test'
});

conn.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});
module.exports = connection;