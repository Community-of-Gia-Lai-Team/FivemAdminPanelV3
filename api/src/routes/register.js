const { Router } = require('express');
const router = Router();
const Perms = require('../../Data/Permissions.json');
const Errors = require('../other/errorsCode.json');
const auth = require('../middleware/Validator/auth.js');
const logger = require('../utils/logger.js');
// router.get('/', (req, res) => {
//     res.json({"status": "success"})
// });

// router.get('/GetStaffList', (req, res) => {
//     res.json({"status": "success"})
// });
router.post('/createAdmin', (req, res) => {
    const { username, password, permission} = req.body;
    console.log(username, password, permission)
    if(username == '' || username == undefined || password == '' || password == undefined || permission == '' || permission == undefined){
        res.json({ "status": "bad", "errorCode": Errors[0].StaffMissingData })
        return;
    }
    if(!res.locals.isAuth){
        res.json({ "status": "bad", "errorCode": Errors[0].NotLoged });
        return;
    }
    if(res.locals.permissions < Perms[0].CreateOtherUsers){
        res.json({ "status": "bad", "errorCode": Errors[0].MissingPermissions });
        return;
    }
    auth.UserExists(username).then(function(value){
        if(value){
            res.json({ "status": "bad", "errorCode": Errors[0].UserAlreadyExist });
            return;
        }
        auth.Register(username, password, permission, res.locals.username);
        res.json({ "status": "success"});
        return;
    }, function(err){
        logger.error(`Error verifying if user exist before creating, error: ${err}`);
        res.json({ "status": "bad", "errorCode": Errors[0].UnknownErrorCode });
        return;
    })
})

module.exports = router;