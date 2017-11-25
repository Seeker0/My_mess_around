'use strict';
//express utilities
const express = require('express');
const app = express();
const server = require('http').createServer(app);

//websocket utilities
const io = require('socket.io')(server);
//additional utilities
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');
const mainRoute = require('./routes/mainRoute');

//app settings
//socket settings
app.use(
  '/socket.io',
  express.static(__dirname + 'node_modules/socket.io-client/dist/')
);

//handlebars settings
app.engine('handlebars', hbs({ partialsDir: 'views/', defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//static files settings
app.use(express.static(__dirname + '/public'));

//mount body & cookie parsers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', mainRoute);

//server setup
server.listen(3000, () =>
  console.log(`Now serving on @ http://localhost/3000`)
);
