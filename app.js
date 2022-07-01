/* jshint esversion : 8 */

const path = require('path');
const express = require('express');
const morgan = require('morgan');

const studentRouter = require('./routes/studentRoutes');
const courseRouter = require('./routes/courseRoutes');
const AppError = require('./utils/AppError');
const globalErreorHandler = require('./controllers/errorController');

const app = express();
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json({limit:'10kb'}));


// ROUTES
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/courses', courseRouter);

app.all('*',function(req,res,next){
    next(new AppError(`Can 't find ${req.originalUrl} on this server `),404);
});

app.use(globalErreorHandler);
    
module.exports = app;

