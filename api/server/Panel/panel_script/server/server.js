exports['screenshot-basic'].requestClientScreenshot(1, {}, (err, data) => {
    //Encode the base64 data
    const imageStream = new Buffer.from(data.split("base64,")[1],'base64');
    //send to the webhook
    console.log("Imagen obtenida")
  })

// const WebSocketClient = require('websocket').client;

// var client = new WebSocketClient();

// const players = getPlayers();
// for(let i = 0; i < players.length; i++){
//     console.log(GetPlayerName(players[i]))
// }

// client.on('connectFailed', function(error) {
//     console.log('Connect Error: ' + error.toString());
// });

// client.on('connect', function(connection) {
//     console.log('Connection established to Admin Panel!');
    
//     connection.on('error', function(error) {
//         console.log("Connection error: " + error.toString());
//     });
    
//     connection.on('close', function() {
//         console.log('Connection closed!');
//     });
    
//     connection.on('message', function(message) {
//         const data = message.utf8Data.split(' ');
//         switch(data[0]){
//             case 'screenshot':
//                 console.log(`Get screenshot of ${data[1]} && ${data[2]}`)
//                 //players[data[1]]
                
//                 break;
//                 //connection.message("Screenshot taked");
//                 //connection.sendUTF("url de la foto");
//         }
//     });
// });

// client.connect('ws://localhost:1350/');