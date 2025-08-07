require('dotenv').config();
require('./models/connection');
var express = require('express');
var app = express();

const mongoose = require('mongoose');
const cors = require('cors');

// ajout pour le serveur et les lobbies
const http = require('http');
const server = http.createServer(app);
// const { Server } = require('socket.io');
const gamesocket = require("./gamesocket");
// Ajout pour le générateur pour les noms de lobby
const lobbiesRouter = require('./routes/lobbies');


// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:3001', // port utilisé pour le frontend
//     methods: ['GET', 'POST']
//   }
// });


var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var manchesRouter = require('./routes/manches');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/manches', manchesRouter);

// Ajout pour le générateur des nom de lobbies
app.use('/lobbies', lobbiesRouter);

gamesocket(server);

server.listen(4000, () => {
  console.log('Serveur Socket.IO démarré sur http://localhost:4000'); // Express sur le port 3000, utilisé un autre
});


module.exports = app;
