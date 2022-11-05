const serverFunctions = require('../server/functions.js');
const { Router } = require('express');
const router = Router();
const Errors = require('../other/errorsCode.json');
const Screenshot = require('../classes/ScreenshotAssign.js');
const Sockets = require('../sockets/index.js')

const AssignedScreenshots = [];

// router.get('/', (req, res) => {
//     res.json({"status": "success"})
// });

setInterval(() => {
    AssignedScreenshots.forEach(element => {
        if(element.state || element.requested){
            return;
        }
        Sockets.GetScreenshot(1).then(function(value){
            element.imageURL = value;
            element.state = true;
        },
        function(err){
            return Errors[0].WebsocketDisconnected;
        })
        element.requested = true;
    });
}, 1000);

router.post('/GetScreenshot', (req, res) => {
    const { id } = req.body;
    if(!res.locals.isAuth){
        res.json({ "status": "bad", "errorCode": Errors[0].NotLoged });
        return;
    }
    serverFunctions.CheckID(id).then(function(value, err){
        if(!value){
            res.json({ "status": "bad", "errorCode": Errors[0].CantFindPlayerID })
            return;
        }
        AssignedScreenshots.push(new Screenshot(AssignedScreenshots.length, id, "Dani", new Date().toLocaleString()))
        res.json({"Status": "Success", "ScreenshotID": AssignedScreenshots.length})
    })
});

router.post('/GetScreenshotStatus', (req, res) => {
    if(!res.locals.isAuth){
        res.json({ "status": "bad", "errorCode": Errors[0].NotLoged });
        return;
    }
    const { scrID } = req.body;
    if(scrID == null || scrID == undefined){
        res.json({ "status": "bad", "errorCode": Errors[0].CantFindScreenshotID });
        return;
    }
    var finded = false;
    AssignedScreenshots.forEach(element => {
        if(element.screenshotID == (scrID - 1)){
            if(element.state){
                res.json({ "status": "success", "State": true, "Image": element.imageURL});
                finded = true;
                return;
            }
            AssignedScreenshots.splice((scrID - 1), 1)
            console.log(AssignedScreenshots);
            res.json({ "status": "success", "State": element.state});
            finded = true;
        }
    });
    if(finded){ return; }
    res.json({ "status": "bad", "errorCode": Errors[0].CantFindScreenshotID });
});

module.exports = router;