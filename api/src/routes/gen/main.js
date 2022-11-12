const { Router } = require('express');
const router = Router();
const Perms = require('../../../Data/Permissions.json');
const Ticket = require('../../classes/TicketSpot.js');
const sqlFunctions = require('../../sql/functions.js');
const Errors = require('../../other/errorsCode.json');
const logger = require('../../utils/logger.js')
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

router.post('/SearchUser', (req, res) => {
    const { username, identifier, firstname, phoneNumber, lastname } = req.body;
    var query = undefined;
    if(username != undefined){
        query = `SELECT identifier, 'name', 'group', firstname, lastname FROM users WHERE name LIKE '${username}%'`;
    } else if(identifier != undefined){
        query = `SELECT identifier, 'name', 'group', firstname, lastname FROM users WHERE identifier LIKE '${identifier}'%`;
    } else if(firstname != undefined && lastname != undefined){
        query = `SELECT identifier, 'name', 'group', firstname, lastname FROM users WHERE firstname LIKE '${firstname}%' AND lastname = %'${lastname}'%`;
    }
    else if(phoneNumber != undefined){
        query = `SELECT identifier, name, group, firstname, lastname FROM users WHERE phone_number LIKE '${phoneNumber}%'`;
    } else {
        res.json({ "status": "bad", "errorCode": Errors[0].MissingDataSearchUser });
        return;
    }

    sqlFunctions.makeQuery(query).then(function(value){
        res.json({"status": "success", "Data": value.result})
    }, function(err){
        res.json({ "status": "bad", "errorCode": Errors[0].UnknownErrorCode });
        logger.error(`Error making a query to database, sql: ${query}, error: ${err}`)
    })
});

router.get('/GetTotalMoney', (req, res) => {
    sqlFunctions.makeQuery(`SELECT accounts FROM users`).then(function(value){
        var bank = 0; var money = 0; var black = 0;
        for(var i = 0; i < value.result.length; i++){
            bank += parseInt(JSON.parse(value.result[i].accounts).bank)
            money += parseInt(JSON.parse(value.result[i].accounts).money)
            black += parseInt(JSON.parse(value.result[i].accounts).black_money)
        }
        res.json({"status": "success", "Data": [{"bank": bank, "money": money, "black": black, "total": bank + money + black}]})
    }, function(err){
        res.json({ "status": "bad", "errorCode": Errors[0].UnknownErrorCode });
    })
});

router.get('/PlayerWithMoreMoney', (req, res) => {
    sqlFunctions.makeQuery(`SELECT name, accounts FROM users`).then(function(value){
        var player = {"username": null, "money": 0};
        for(var i = 0; i < value.result.length; i++){
            var bank = 0; var money = 0; var black = 0; var total = 0;
            bank += parseInt(JSON.parse(value.result[i].accounts).bank)
            money += parseInt(JSON.parse(value.result[i].accounts).money)
            black += parseInt(JSON.parse(value.result[i].accounts).black_money)
            total = bank + money + black;
            if(total > player.money){
                player = {"username": value.result[i].name, "money": total}
            }
        }
        res.json({"status": "success", "Data": player})
    }, function(err){
        res.json({"status": "bad", "errorCode": Errors[0].UnknownErrorCode });
    })
});

router.get('/RegisteredUsersCount', (req, res) => {
    sqlFunctions.makeQuery(`SELECT COUNT(*) FROM users`).then(function(value){
        res.json({"status": "success", "Data": value.result[0]['COUNT(*)']})
    }, function(err){
        res.json({"status": "bad", "errorCode": Errors[0].UnknownErrorCode });
    })
});

router.get('/OnlineUsersCount', (req, res) => {
    const ip = req.ip.substring(7);
    var url = "https://servers-frontend.fivem.net/api/servers/single/mmlzra";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.setRequestHeader("Accept", "application/json");

    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        var obj = JSON.parse(xhr.responseText);
        res.json({"Status": "Success", "Result": obj.Data.players.length});
    }};

    xhr.send();
});

module.exports = router;