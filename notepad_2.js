'use strict';

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const hbs = require('express-handlebars');
const redis = require('redis');
const io = require('socket.io');
const client = socket.io.createClient(server);

app.use(
  '/socket.io',
  express.static(__dirname + 'node_modules/socket.io-client/dist/')
);

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

server.listen(3000);
