const cookieParser = require('cookie-parser')
const auth = require('./Validator/auth.js');
const config = require('../../Config.json');

module.exports = function (data) {
    return function (req, res, next) {
        var cookieData = {};
        for(const key in data){
            if(key == config[2].cookieName){
                cookieData.Finded = true;
            }
        }
        if(!cookieData.Finded || !cookieData.Valid){
            res.json({"status": "bad"})
            return;
        }

        auth.CreateToken(data.user, data.password, data.permission);
        next();
    }
}