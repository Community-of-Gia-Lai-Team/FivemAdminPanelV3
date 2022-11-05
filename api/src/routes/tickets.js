const { Router } = require('express');
const router = Router();
const Perms = require('../../Data/Permissions.json');
const Ticket = require('../classes/TicketSpot.js');
const sqlFunctions = require('../sql/functions.js');
const Errors = require('../other/errorsCode.json');
const logger = require('../utils/logger.js')

router.get('/RecentTickets', (req, res) => {
    if(!res.locals.isAuth){
        res.json({ "status": "bad", "errorCode": Errors[0].NotLoged });
        return;
    }
    if(res.locals.permissions < Perms[0].SeeLastTickets){
        res.json({ "status": "bad", "errorCode": Errors[0].MissingPermissions });
        return;
    }
    var sql = `SELECT * FROM panel_tickets`;
    sqlFunctions.makeQuery(sql).then(data => {
        var list = [];
        data.result.forEach(element => {
            if(res.locals.permissions < element.AllowedStaff){
                return;
            }
            list.push(new Ticket(element.ID, element.Staff, element.Type, JSON.parse(element.UserData), element.Date, element.AllowedStaff, element.Reason, element.Comment));
        });
        res.json({"status": "success", "List": list})
    }, function(err){
        res.json({ "status": "bad", "errorCode": Errors[0].UnknownErrorCode });
        logger.error(`Error making a query to database, sql: ${sql}, error: ${err}`)
    })
})

router.post('/TicketsFromUser', (req, res) => {
    if(!res.locals.isAuth){
        res.json({ "status": "bad", "errorCode": Errors[0].NotLoged });
        return;
    }
    if(res.locals.permissions < Perms[0].SeeTicketsOfUser){
        res.json({ "status": "bad", "errorCode": Errors[0].MissingPermissions });
        return;
    }
    const { steamID } = req.body;
    if(steamID == undefined){
        res.json({ "status": "bad", "errorCode": Errors[0].MissingSteamTicket });
        return;
    }
    var sql = `SELECT * FROM panel_tickets WHERE UserData LIKE '%${steamID}%'`;
    sqlFunctions.makeQuery(sql).then(data => {
        var list = [];
        data.result.forEach(element => {
            if(res.locals.permissions < element.AllowedStaff){
                return;
            }
            list.push(new Ticket(element.ID, element.Staff, element.Type, JSON.parse(element.UserData), element.Date, element.AllowedStaff, element.Reason, element.Comment));
        });
        res.json({"status": "success", "List": list})
    }, function(err){
        res.json({ "status": "bad", "errorCode": Errors[0].UnknownErrorCode });
        logger.error(`Error making a query to database, sql: ${sql}, error: ${err}`)
    })
});

router.post('/CreateTicket', (req, res) => {
    if(!res.locals.isAuth){
        res.json({ "status": "bad", "errorCode": Errors[0].NotLoged });
        return;
    }
    if(res.locals.permissions < Perms[0].CreateTickets){
        res.json({ "status": "bad", "errorCode": Errors[0].MissingPermissions });
        return;
    }
    const { type, userData, allowedStaff, reason, comment } = req.body;
    if(type == undefined || userData == undefined || allowedStaff == undefined || reason == undefined || comment == undefined){
        res.json({ "status": "bad", "errorCode": Errors[0].MissingTicketData });
        return;
    }
    var sql = `INSERT INTO panel_tickets (Staff, Type, UserData, AllowedStaff, Reason, Comment) VALUES ('${res.locals.username}', '${type}', '${userData}', '${allowedStaff}', '${reason}', '${comment}');`;
    sqlFunctions.makeQuery(sql).then(data => {
        var list = [];
        res.json({"status": "success"})
    }, function(err){
        res.json({ "status": "bad", "errorCode": Errors[0].UnknownErrorCode });
        logger.error(`Error making a query to database, sql: ${sql}, error: ${err}`)
    })
});

module.exports = router;