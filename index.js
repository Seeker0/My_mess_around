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
const c_session = require('cookie-session');
const hbs = require('express-handlebars');
const mainRoute = require('./routes/mainRoute');

//modules
const promises = require('./lib/promises.js');

//app settings

//cookie sessions settings
app.use(
  c_session({
    name: 'session',
    keys: [
      Math.random()
        .toString(36)
        .substring(13)
    ],
    maxAge: 24 * 60 * 60 * 1000 //24 hours
  })
);

//socket settings
app.use(
  '/socket.io',
  express.static(__dirname + 'node_modules/socket.io-client/dist/')
);

//handlebars settings
app.engine('handlebars', hbs({ partialsDir: 'views/', defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//static files settings
app.use(express.static('./public'));

//mount body & cookie parsers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//router mount
app.use('/', mainRoute);

//socket methods
io.on('connection', client => {
  client.on('pocketSelect', pocket => {
    let items;
    promises
      .getData(pocket)
      .then(data => (items = data))
      .then(data => console.log(data, items))
      .then(data => io.emit('fillItems', items))
      .catch(console.error);
  });
});

//server setup
server.listen(3000, () =>
  console.log(`Now serving on @ http://localhost/3000`)
);
