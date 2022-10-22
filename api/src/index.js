const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const morgan = require('morgan');
const mdw = require('./middleware/ValidateSession.js');
const config = require('../Config.json');
const colors = require('colors');

//settings
app.set('json spaces', 2);

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser())
app.use(mdw({ option1: '1', option2: '2' }))

//routes
app.use('/api/', require('./routes/routes.js'));

//start the api server
app.listen(config[0].ApiPort, () => {
    console.log(colors.blue(`API listening on port: ${config[0].ApiPort}`))
})