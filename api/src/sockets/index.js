const WebSocket = require('ws');
const colors = require('colors');
const Errors = require('../other/errorsCode.json');
const logger = require('../utils/logger.js');

var ws = undefined;
var wsServer = undefined;

function StartSocket(port){
    const wsPort = parseInt(port);
    if(wsPort == null || wsPort == '' || wsPort < 100){
        logger.warn(`Invalid socket port: ${wsPort}`);
        return;
    }
    ws = new WebSocket.Server({port: wsPort})
    logger.info(`WebSocket listening in port: ${wsPort}`);
    ListenConnections();
}

function ListenConnections(){
    ws.on('connection', function(wss){
        wsServer = wss;
        logger.info("Fivem Server connected to websocket");
    })

    ws.on('close', function close(){
        logger.warn("Websocket closed");
    })
}

const GetScreenshot = function(id){
    return new Promise(function(resolve, reject){
        if(wsServer == undefined || ws == undefined){
            reject(false);
        }
        var timer = setTimeout(() => {
            resolve(false);
        }, 10000);
        wsServer.send(`screenshot ${id} ${id}`);
        wsServer.on('message', function(message){
            const data = JSON.parse(message.toString('utf8'));
            if(data.screenshotID != id){ return; }
            const imageUrl = data.imageURL;
            clearTimeout(timer);
            resolve(true);
        })
    });
}

module.exports = { StartSocket, GetScreenshot }