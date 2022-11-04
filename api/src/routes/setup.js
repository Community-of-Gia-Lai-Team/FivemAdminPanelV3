const { Router } = require('express');
const router = Router();
var config = require('../../Data/Config.json');
const fs = require('fs');
const Errors = require('../other/errorsCode.json');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);
const sqlFunctions = require('../sql/functions.js');
const rconFunctions = require('../rcon/functions.js');
const ftpFunctions = require('../ftp/functions.js');
const logger = require('../utils/logger.js');

router.post('/selectframework', (req, res) => {
    if (config[0].Setup) {
        res.json({ "status": "bad", "errorCode": Errors[0].CantMakeSetupTwice })
        return;
    }
    const { newFramework } = req.body;
    if (newFramework != "esx" && newFramework != "qbcore" && newFramework != "vrp" && newFramework != "vrpex") {
        res.json({ "status": "bad", "errorCode": Errors[0].IncorrectFrameworkSelected })
        return;
    }
    try {
        config[3].framework = newFramework;
        const path = `${appDir}\\..\\Data/Config.json`;
        fs.writeFile(path, JSON.stringify(config, null, "\t"), function writeJSON(err) {
            if (err){
                logger.error(`Error when trying to select framework: ${err}`); return;
            }
            res.json({ "status": "success" });
        });
    } catch (err) {
        res.json({ "status": "bad", "errorCode": Errors[0].UnknownErrorCode })
    }
});

router.post('/checkDatabase', (req, res) => {
    if (config[0].Setup) {
        res.json({ "status": "bad", "errorCode": Errors[0].CantMakeSetupTwice })
        return;
    }
    const db = req.body;
    if (db.host == undefined || db.user == undefined || db.password == undefined || db.name == undefined || db.port == undefined) {
        res.json({ "status": "bad", "errorCode": Errors[0].InvalidDBCredentials });
        return;
    }
    sqlFunctions.checkDatabase(req.body).then(
        function (value) {
            config[1].db_server = db.host;
            config[1].db_port = db.port;
            config[1].db_username = db.user;
            config[1].db_password = db.password;
            config[1].db_name = db.name;
            const path = `${appDir}\\..\\Data/Config.json`;
            fs.writeFile(path, JSON.stringify(config, null, "\t"), function writeJSON(err) {
                if (err){
                    res.json({ "status": "bad", "errorCode": Errors[0].UnknownErrorCode })
                    logger.error(`Error when trying to change database credentials: ${err}`);
                    return;
                }
                res.json({ "status": "success" });
            });
            return;
        },
        function (error) {
            res.json({ "status": "bad", "errorCode": Errors[0].CantConnectToDB })
            return;
        }
    );
});

router.post('/checkRcon', (req, res) => {
    if (config[0].Setup) {
        res.json({ "status": "bad", "errorCode": Errors[0].CantMakeSetupTwice })
        return;
    }
    const rcon = req.body;
    if (rcon.host == undefined || rcon.port == undefined || rcon.password == undefined) {
        res.json({ "status": "bad", "errorCode": Errors[0].InvalidRconCredentials });
        return;
    }
    rconFunctions.checkRcon(req.body).then(
        function (value) {
            if (value == 'pwd') {
                res.json({ "status": "bad", "errorCode": Errors[0].RconInvalidPassword })
                return;
            }
            config[7].rcon_ip = rcon.host;
            config[7].rcon_port = rcon.port;
            config[7].rcon_password = rcon.password;
            const path = `${appDir}\\..\\Data/Config.json`;
            fs.writeFile(path, JSON.stringify(config, null, "\t"), function writeJSON(err) {
                if (err){
                    res.json({ "status": "bad", "errorCode": Errors[0].UnknownErrorCode })
                    logger.error(`Error when trying to change rcon credentials: ${err}`);
                    return;
                }
                res.json({ "status": "success" });
            });
            return;
        },
        function (error) {
            res.json({ "status": "bad", "errorCode": Errors[0].CantConnectToRcon })
            return;
        }
    )
});

router.post('/checkFtp', (req, res) => {
    if (config[0].Setup) {
        res.json({ "status": "bad", "errorCode": Errors[0].CantMakeSetupTwice })
        return;
    }
    const ftp = req.body;
    if (ftp.host == undefined || ftp.username == undefined || ftp.password == undefined || ftp.port == undefined) {
        res.json({ "status": "bad", "errorCode": Errors[0].InvalidDBCredentials });
        return;
    }
    ftpFunctions.CheckFtpConnection(ftp).then(
        function (value){
            config[6].ftp_server = ftp.host;
            config[6].ftp_port = ftp.port;
            config[6].ftp_username = ftp.username;
            config[6].ftp_password = ftp.password;
            const path = `${appDir}\\..\\Data/Config.json`;
            fs.writeFile(path, JSON.stringify(config, null, "\t"), function writeJSON(err) {
                if (err){
                    res.json({ "status": "bad", "errorCode": Errors[0].UnknownErrorCode })
                    logger.error(`Error when trying to change ftp credentials: ${err}`);
                    return;
                }
                res.json({ "status": "success" });
            });
            return;
        },
        function (error){
            res.json({ "status": "bad", "errorCode": Errors[0].CantConnectToFtp })
        }
    )
});

router.get('/summary', (req, res) => {
    if (config[0].Setup) {
        res.json({ "status": "bad", "errorCode": Errors[0].CantMakeSetupTwice })
        return;
    }
    const summary = {};
    try {
        config[0].Setup = true;
        const path = `${appDir}\\..\\Data/Config.json`;
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            obj = JSON.parse(data)
            summary.framework = obj[3].framework;
            summary.db_server = obj[1].db_server;
            summary.db_password = obj[1].db_password;
            summary.db_port = obj[1].db_port;
            summary.db_name = obj[1].db_name;
            summary.db_username = obj[1].db_username;
            summary.rcon_ip = obj[7].rcon_ip;
            summary.rcon_port = obj[7].rcon_port;
            summary.rcon_password = obj[7].rcon_password;
            summary.ftp_server = obj[6].ftp_server;
            summary.ftp_port = obj[6].ftp_port;
            summary.ftp_username = obj[6].ftp_username;
            summary.ftp_password = obj[6].ftp_password;
            res.json({ "status": "success", "summary": summary});
        });
    } catch (err) {
        res.json({ "status": "bad", "errorCode": Errors[0].UnknownErrorCode })
    }
})

router.get('/finish', (req, res) => {
    if (config[0].Setup) {
        res.json({ "status": "bad", "errorCode": Errors[0].CantMakeSetupTwice })
        return;
    }
    try{
        config[0].Setup = true;
        const path = `${appDir}\\..\\Data/Config.json`;
        fs.writeFile(path, JSON.stringify(config, null, "\t"), function writeJSON(err) {
            if (err){
                logger.error(`Error when trying to finish the config: ${err}`); return;
            }
            obj = {"username": "panel@panel.com", "password": "panel1234"};
            res.json({ "status": "success", "default_account": obj});
        });
    }catch(err){
        res.json({ "status": "bad", "errorCode": Errors[0].UnknownErrorCode })
    }
});

module.exports = router;