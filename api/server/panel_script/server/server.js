const WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('Connection established to Admin Panel!');
    
    connection.on('error', function(error) {
        console.log("Connection error: " + error.toString());
    });
    
    connection.on('close', function() {
        console.log('Connection closed!');
    });
    
    connection.on('message', function(message) {
        const data = message.utf8Data.split(' ');
        switch(data[0]){
            case 'screenshot':
                console.log(`Get screenshot of ${data[1]} && ${data[2]}`)
                for(let i = 0; i < 200; i++){
                    if(GetPlayerName(`${i}`) == data[2]){
                        connection.sendUTF(`ID: ${i}`);
                    }
                }
                //connection.message("Screenshot taked");
                //connection.sendUTF("url de la foto");
        }
    });
});

client.connect('ws://localhost:1350/');