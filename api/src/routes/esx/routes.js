const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.json({"status": "success"});
});

// router.get('/GetStaffList', (req, res) => {
//     res.json({"status": "success"})
// });

module.exports = router;