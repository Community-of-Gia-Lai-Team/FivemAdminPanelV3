const { Router } = require('express');
const router = Router();
const Errors = require('../other/errorsCode.json');
// router.get('/', (req, res) => {
//     res.json({"status": "success"})
// });

// router.get('/GetStaffList', (req, res) => {
//     res.json({"status": "success"})
// });
router.post('/createAdmin', (req, res) => {
    const { username, password} = req.body;
    if(username == '' || username == null || password == '' || password == null ){
        res.json({ "status": "bad", "errorCode": Errors[0].RegisterMissingData })
    }
    
})

module.exports = router;