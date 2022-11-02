const ftp = require("basic-ftp");
const config = require('../../Config.json');

const CheckFtpConnection = function(credentials){
    return new Promise(function(resolve, reject){
        const client = new ftp.Client()
        client.ftp.verbose = false
        
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


async function GetFileList(path) {
    const client = new ftp.Client()
    client.ftp.verbose = false
    try {
        await client.access({
            host: config[6].ftp_server,
            user: config[6].ftp_username,
            password: config[6].ftp_password,
            secure: false
        })
        await client.ensureDir(path)
        return await client.list()
    }
    catch(err) {
        console.log(err)
    }
    client.close()
}

async function UploadFile(folderPath) {
    const client = new ftp.Client()
    client.ftp.verbose = false
    try {
        await client.access({
            host: config[6].ftp_server,
            user: config[6].ftp_username,
            password: config[6].ftp_password,
            secure: false
        })
        await client.ensureDir(folderPath)
        await client.uploadFromDir('./server/panel_script')
    }
    catch(err) {
        console.log(err)
    }
    client.close()
}

module.exports = { CheckFtpConnection, GetFileList, UploadFile };