const mysql = require('mysql');
const connection = require('./connection.js');

const con = connection();
const makeQuery = function(query){
    return new Promise(function(resolve, reject){
        con.query(query, function(err, result, fields){
            if(err) reject(err);
            resolve({"result":result, "fields": fields});
        })
    });
}

module.exports = { makeQuery };