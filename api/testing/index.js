var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

var isConnected = false;

client.on('connect', function(connection){ Connection(connection)})

function Connection(connection){
    isConnected = true;

    connection.on('error', function(error){
        isConnected = false;
    });

    connection.on('close', function() {
        isConnected = false;
    });

    connection.on('message', function(message) {
        const command = message.utf8Data.split(" ")
        switch(command[0]){
            case 'screenshot':
                console.log('screenshot')
                const playerID = command[1]; const screenshotID = command[2];
                const obj = JSON.stringify({"screenshotID": screenshotID, "imageURL": "https://imgur.io/test.png"});
                SendMessage(connection, obj);
                break;
        }
    });
}


function SendMessage(connection, message){
    if(!connection.connected){
        return;
    }
    connection.sendUTF(message.toString());
}

setInterval(() => {
    if(isConnected){
        return;
    }
    client.connect('ws://localhost:1350/');
}, 500);
