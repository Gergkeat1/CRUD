var Sequelize = require('sequelize')
var db = require("../database/connection")

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