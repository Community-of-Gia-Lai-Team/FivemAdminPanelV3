const cookieParser = require('cookie-parser')
const auth = require('./Validator/auth.js');
const config = require('../../Config.json');
const Enum = require('enum');

//Check if token is valid, if is not valid return error code based in other/errosCode.json
module.exports = function () {
    return function (req, res, next) {
        if(!config[0].Setup){
            next();
            return;
        }
        data = req.cookies;
        var Finded = false;
        for(const key in data){
            if(key == config[2].cookieName){
                Finded = true;
                var isAuth = false;
                const cookieValue = data[key]
                auth.ValidateToken(cookieValue).then(function(data){
                    res.locals.auth = isAuth;
                    if(data){
                        auth.GetDataFromToken(cookieValue).then(function(data2) {
                            res.locals.permissions = data2[0].Permission;
                            res.locals.token = cookieValue;
                            res.locals.isAuth = true;
                            next();
                        })
                    } else {
                        res.locals.isAuth = false;
                        next();
                    }
                })
            }
        }
        if(!Finded){
            res.locals.isAuth = false;
            next();
            return;
        }
    }
}