'use strict';
// https://webpack.js.org/guides/dependency-management/#require-with-expression
const env = require('./config/env');
const app = require('express')();
const router = require('./router');
// set port
const PORT = process.env.PORT || 7331;
// trust downstream proxy
app.set('trust proxy', true);
// app listen
app.listen(PORT, console.log(`App running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`));
// route all
app.all('*', router);
// will be changed to pass config inside
module.exports = app;
