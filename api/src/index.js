const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const morgan = require('morgan');
const mdw = require('./middleware/ValidateSession.js');
const config = require('../Data/Config.json');
const rcon = require('./rcon/functions.js');
const colors = require('colors');
const cors = require('cors');
const installation = require('./installation.js');
const websocket = require('./sockets/index.js')
const screenshot = require('./routes/screenshot.js');
const serverFunctions = require('./server/functions.js');
const chalk = require('chalk');
const logger = require('./utils/logger.js');

//settings
app.set('json spaces', 2);

//middlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use(mdw());
app.use(cors({
    origin: '*'
}));

//routes
app.use('/api/', require('./routes/accounts.js'));
app.use('/api/', require('./routes/esx/routes.js'));
app.use('/api/', require('./routes/register.js'));
app.use('/api/setup/', require('./routes/setup.js'));
app.use('/api/', require('./routes/screenshot.js'));
app.use('/api/installation/', require('./server-script.js'));
app.use('/api/', require('./routes/tickets.js'));

console.log(chalk.magenta(`
_______    ______   __    __  ________  __       
/       \\  /      \\ /  \\  /  |/        |/  |      
$$$$$$$  |/$$$$$$  |$$  \\ $$ |$$$$$$$$/ $$ |      
$$ |__$$ |$$ |__$$ |$$$  \\$$ |$$ |__    $$ |      
$$    $$/ $$    $$ |$$$$  $$ |$$    |   $$ |      
$$$$$$$/  $$$$$$$$ |$$ $$ $$ |$$$$$/    $$ |      
$$ |      $$ |  $$ |$$ |$$$$ |$$ |_____ $$ |_____ 
$$ |      $$ |  $$ |$$ | $$$ |$$       |$$       |
$$/       $$/   $$/ $$/   $$/ $$$$$$$$/ $$$$$$$$/                                      
       ${chalk.italic.gray(`v0.1.5 - by DaniGP17 & Sergi`)}
`));

//start the api server
app.listen(config[0].ApiPort, () => {
    logger.info(`API listening on port: ${config[0].ApiPort}`);
    websocket.StartSocket(config[0].WsPort);
});