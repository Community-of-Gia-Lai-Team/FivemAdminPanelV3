const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const morgan = require('morgan');
const mdw = require('./middleware/ValidateSession.js');
const config = require('../Config.json');
const rcon = require('./rcon/functions.js');
const colors = require('colors');
const cors = require('cors');

//settings
app.set('json spaces', 2);

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser())
app.use(mdw())
app.use(cors({
    origin: '*'
}));

//routes
app.use('/api/', require('./routes/routes.js'));
app.use('/api/setup/', require('./routes/setup.js'));

//start the api server
app.listen(config[0].ApiPort, () => {
    console.log(colors.blue(`API listening on port: ${config[0].ApiPort}`))
})