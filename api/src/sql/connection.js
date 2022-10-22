const config = require('../../Config.json');
const mysql = require('mysql');

//Create connection to database
const connection = mysql.createConnection({
    host: config[1].db_server,
    port: config[1].db_port,
    user: config[1].db_username,
    password: config[1].db_password,
    database: config[1].db_name,
})

module.exports = function() {
    return connection;
}