const { Router } = require('express');
const router = Router();
const logger = require('../utils/logger.js');
const auth = require('../middleware/Validator/auth.js');
const Errors = require('../other/errorsCode.json');
const md5 = require('md5');

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

module.exports = router;