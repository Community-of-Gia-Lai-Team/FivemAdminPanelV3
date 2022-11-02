const WebSocket = require('ws');
const ws = new WebSocket.Server({port: 8000});
ws.on('connection', function connection(wss){
    console.log(`New connection from ${wss}`);
})