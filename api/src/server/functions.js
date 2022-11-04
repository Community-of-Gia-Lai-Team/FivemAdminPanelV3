const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const logger = require('../utils/logger.js');

const CheckID = function(id) {
    return new Promise(function(resolve, reject){
        var url = "https://servers-frontend.fivem.net/api/servers/single/q568kz";

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
    
        xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            const obj = JSON.parse(xhr.responseText);
            if(obj.Data.clients == 0){
                logger.warn("Trying to read id but there's 0 players in the server");
                reject(false);
            }
            obj.Data.players.forEach(player => {
                if(player.id == id){
                    resolve(true);
                }
            });
            resolve(false);
        }};
    
        xhr.send();
    });
}

module.exports = { CheckID }