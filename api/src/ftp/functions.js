const ftp = require("basic-ftp") 

// const conn = new Rcon('83.63.49.210', 30120, "12345678", options);

const CheckFtpConnection = function(credentials){
    return new Promise(function(resolve, reject){
        const client = new ftp.Client()
        client.ftp.verbose = false
        var connected = false;
        
        client.access({
            host: credentials.host,
            user: credentials.username,
            password: credentials.password,
            secure: credentials.secure
        })

        process.on('unhandledRejection', (reason, promise) => {
            reject(false);
        })
        
        setTimeout(() => {
            resolve(true);
        }, 1000);
    })
}

module.exports = { CheckFtpConnection };