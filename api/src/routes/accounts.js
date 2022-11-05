const { Router, application } = require('express');
const router = Router();
const logger = require('../utils/logger.js');
const auth = require('../middleware/Validator/auth.js');
const Errors = require('../other/errorsCode.json');
const md5 = require('md5');
const staffSpot = require('../classes/StaffSpot.js');
const sqlFunctions = require('../sql/functions.js');
const Perms = require('../../Data/Permissions.json');

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if(res.locals.username != undefined){
        res.json({"status": "success"})
        return;
    }
    if(username == undefined || username == '' || password == undefined || password == ''){
        res.json({ "status": "bad", "errorCode": Errors[0].PasswordOrUsernameCantBeEmpty });
        return;
    }
    auth.Login(username, md5(password)).then(function(value){
        if(value.length > 0){
            auth.GenerateTokenHash({"username": username, "password": password, "permissions": value[0].Permission, "time": Date.now()}).then(function(value){
                res.json({"status": "success", "Cookie": value});
            }, function(err){
                logger.error(`Error trying to generate token hash, username: ${username}, error: ${err}`);
            });
            return;
        }
        res.json({ "status": "bad", "errorCode": Errors[0].InvalidLogin });
    }, function(err){
        logger.error("Error trying to login");
        res.json({ "status": "bad", "errorCode": Errors[0].UnknownErrorCode });
    });
});

router.get('/getStaffList', (req, res) => {
    if(!res.locals.isAuth){
        res.json({ "status": "bad", "errorCode": Errors[0].NotLoged });
        return;
    }
    if(res.locals.permissions < Perms[0].SeeStaffList){
        res.json({ "status": "bad", "errorCode": Errors[0].MissingPermissions });
        return;
    }
    const sql = `SELECT ID, Username, JoinedDate, Permission, CreatedBy, IsDesktop, IsOnline FROM panel_users`;
    sqlFunctions.makeQuery(sql).then(data => {
        var list = [];
        data.result.forEach(element => {
            list.push(new staffSpot(element.ID, element.Username, element.JoinedDate, element.Permission, element.CreatedBy, element.IsDesktop, element.IsOnline))
        });
        res.json({"status": "success", "List": list})
    }, function(err){
        logger.error(`Error making a query to database, sql: ${sql}, error: ${err}`)
    })
});

module.exports = router;