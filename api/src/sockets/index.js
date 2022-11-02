const WebSocket = require('ws');

const ws = new WebSocket.Server({port: 1350})

ws.on('connection', function(wss){
    console.log("conectado")
    wss.on('message', function(message){
        console.log('received: ', message);
    })

    wss.send('connection response');
})