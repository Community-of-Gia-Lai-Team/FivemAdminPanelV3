const crypto = require('crypto');
const sqlFunctions = require('../../sql/functions.js');

function GenerateTokenHash(obj){
    // if((obj.username == undefined) || (obj.password == undefined) || (obj.permissions == undefined)){
    //     return false;
    // }
    // var hash = '';

    // for (const key in obj) {
    //     let md5 = crypto.createHash('md5').update(key).digest("hex");
    //     hash += md5.slice(0, -20);
    // }

    // return hash;
    sqlFunctions.makeQuery("SELECT * FROM panel_users").then(function(data){
        console.log(data);
    })
}

function CreateToken(username, password, permission){
    //console.log(GenerateTokenHash({"username": username, "password": password, "permissions": permission}));
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

module.exports = { CreateToken, ValidateToken, RemoveToken, GetDataFromToken }