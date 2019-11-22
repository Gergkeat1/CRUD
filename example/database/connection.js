var sequelize = require('sequelize');

var db={}


var sequelize  = new sequelize("test"/*DBname*/,"root"/*Username*/,"root"/*Password*/,{
    host: 'localhost',
    dialect:"mysql",// DBMS ที่จะใช้
    // operatorsAliases: false, //Sequelize v6 ไม่สามารถใช้ได้

    pool:{
        max:5,
        min:0,
        acquire:30000,
        idel: 10000
    }
});

db.sequelize =sequelize

module.exports = db;