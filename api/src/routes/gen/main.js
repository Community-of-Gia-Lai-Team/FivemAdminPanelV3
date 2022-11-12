const { Router } = require('express');
const router = Router();
const Perms = require('../../../Data/Permissions.json');
const Ticket = require('../../classes/TicketSpot.js');
const sqlFunctions = require('../../sql/functions.js');
const Errors = require('../../other/errorsCode.json');
const logger = require('../../utils/logger.js')

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

module.exports = router;