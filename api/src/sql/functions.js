const mysql = require('mysql');
const connection = require('./connection.js');

const con = connection();
const makeQuery = function(query){
    return new Promise(function(resolve, reject){
        try{
            con.query(query, function(err, result, fields){
                if(err) reject(err);
                resolve({"result":result, "fields": fields});
            })
        }
        catch(err){
            reject(err);
        }
    });
}

const checkDatabase = function(credentials){
    return new Promise(function(resolve, reject){
        const conn = mysql.createConnection({
            host: credentials.host,
            user: credentials.user,
            password: credentials.password,
            database: credentials.name,
            port: credentials.port
        });
        conn.connect(function(err) {
            if(err) {
                reject(false);
                return;
            }
            resolve(true);
        })
    });
}

module.exports = { makeQuery, checkDatabase };