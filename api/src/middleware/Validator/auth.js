const crypto = require('crypto');
const sqlFunctions = require('../../sql/functions.js');
const md5 = require('md5');

const Login = function(username, password){
    return new Promise(function(resolve, reject){
        sqlFunctions.makeQuery(`SELECT ID, Permission FROM panel_users WHERE Username='${username}' AND Password='${password}'`).then(data => {
            resolve(data.result)
        })
    });
}

const Register = function(username, password, permissions, admin){
    return new Promise(function(resolve, reject){
        sqlFunctions.makeQuery(`INSERT INTO panel_users (Username, Password, Permission, CreatedBy) VALUES ('${username}', '${md5(password)}', '${permissions}', '${admin}')`).then(data => {
            resolve(data.result)
        })
    });
}

function removeRandomLetter(str) {
    var pos = Math.floor(Math.random()*str.length);
    return str.substring(0, pos)+str.substring(pos+1);
}

const GenerateTokenHash = function(obj){
    return new Promise(function(resolve, reject){
        if((obj.username == undefined) || (obj.password == undefined) || (obj.permissions == undefined)){
            reject(false);
        }
        var hash = '';
    
        for (const key in obj) {
            let md5 = crypto.createHash('md5').update(key).digest("hex");
            hash += md5;
        }

        for(var i = 0; i < 90; i++) {
            hash = removeRandomLetter(hash);
        }
    
        sqlFunctions.makeQuery(`UPDATE panel_users SET Token = '${hash}' WHERE Username = '${obj.username}'`).then(function(data){
            resolve(hash);
        })
    });
}

const UserExists = function(username){
    return new Promise(function(resolve, reject){
        sqlFunctions.makeQuery(`SELECT ID FROM panel_users WHERE Username='${username}'`).then(data => {
            resolve(data.result.length > 0)
        })
    });
}

const ValidateToken = function(token){
    return new Promise(function(resolve, reject){
        sqlFunctions.makeQuery(`SELECT ID FROM panel_users WHERE Token='${token}'`).then(data => {
            resolve(data.result.length > 0)
        })
    });
}

function RemoveToken(){

}

// function GetDataFromToken(token){
//     sqlFunctions.makeQuery(`SELECT * FROM panel_users WHERE Token='${token}'`).then(data => {
//         return data.result[0]
//     })
// }

const GetDataFromToken = function(token){
    return new Promise(function(resolve, reject){
        sqlFunctions.makeQuery(`SELECT * FROM panel_users WHERE Token='${token}'`).then(data => {
            resolve(data.result)
        })
    });
}

module.exports = { ValidateToken, GenerateTokenHash, RemoveToken, GetDataFromToken, Login, UserExists, Register }