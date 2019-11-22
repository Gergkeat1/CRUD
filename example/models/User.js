var Sequelize = require('sequelize'),
passportLocalSequelize = require('passport-local-sequelize');

var db = require("../database/connection")
var User = passportLocalSequelize.defineUser(sequelize, {
    favoriteColor: Sequelize.STRING
});

module.exports= db.sequelize.define(
    'test_profile'/* MOU name*/,{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        username:{
            type:Sequelize.STRING,
            // notnull:true
        },
        password:{
            type:Sequelize.STRING,
            // notnull:true
        },
        fname:{
            type:Sequelize.STRING
        },
        lname:{
            type:Sequelize.STRING
        },
        tel:{
            type:Sequelize.STRING
        },
        age:{
            type:Sequelize.INTEGER
        },
    },
    {
        timestamps:false,
        freezeTableName:true
    }
)