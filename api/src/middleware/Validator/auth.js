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

function ValidateToken(){

}

function RemoveToken(){

}

module.exports = { CreateToken }