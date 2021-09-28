require('dotenv').config(); // added package dot env

const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const officeRouter = require('./routes/office');
const userManagementRouter = require('./routes/userManagement');


const verifyToken = require('./middlewares/verifyToken'); //For Verify User Token Login
const role= require('./middlewares/permission'); //For Verify User Role Login

const app = express();

app.use(cors()); // CORS
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/office', verifyToken, officeRouter);
app.use('/user', verifyToken, userManagementRouter);

module.exports = app;
