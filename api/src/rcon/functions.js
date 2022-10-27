const Rcon = require('rcon');

var options = {
    tcp: false,
    challenge: false
};

// const conn = new Rcon('83.63.49.210', 30120, "12345678", options);

const checkRcon = function(credentials){
    return new Promise(function(resolve, reject){
        const conn = new Rcon(credentials.host, credentials.port, credentials.password, options);
        var resolved = false;
        conn.connect();
        var hasAnswered = false;
        conn.on('auth', function() {
            conn.send('heartbeat')
        }).on('response', function(str) {
            if(str == 'rint'){
                hasAnswered = true;
            } else if(str.includes('Invalid password')) {
                resolve('pwd');
                resolved = true;
                return;
            }
        }).on('error', function(err) {
            reject(false);
        });
        if(resolved){
            return;
        }
        setTimeout(() => {
            if(hasAnswered){
                resolve(3);
            } else {
                reject(false);
            }
        }, 1000);
    });
}

module.exports = { checkRcon };