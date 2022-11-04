const cookieParser = require('cookie-parser')
const auth = require('./Validator/auth.js');
const config = require('../../Data/Config.json');
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
                    res.locals.isAuth = isAuth;
                    if(data){
                        auth.GetDataFromToken(cookieValue).then(function(data2) {
                            res.locals.permissions = data2[0].Permission;
                            res.locals.username = data2[0].Username;
                            res.locals.password = data2[0].Password;
                            res.locals.joinDate = data2[0].JoinedDate;
                            res.locals.createdBy = data2[0].CreatedBy;
                            res.locals.isDesktop = data2[0].isDesktop;
                            res.locals.isOnline = data2[0].isOnline;
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