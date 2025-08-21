require('dotenv').config();
require('./models/connection');
var express = require('express');
var app = express();

const mongoose = require('mongoose');
const cors = require('cors');

// ajout pour les lobbies
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
// Ajout pour le générateur pour les noms de lobby
const lobbiesRouter = require('./routes/lobbies');


const io = new Server(server, {
  cors: {
origin: [
    "https://guessthekey.vercel.app/", // Remplace par ton URL Vercel
    "http://localhost:4000"
  ],
  methods: ["GET", "POST","PUT", "DELETE"],
  credentials: true
  }
});

app.use(express.json());

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var manchesRouter = require('./routes/manches');
var queteRouter = require('./routes/quete');


var missionsCampagneRouter = require('./routes/missionCampagne');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(cors({
origin: [
"https://mon-frontend.vercel.app", // Remplace par ton URL Vercel
"http://localhost:4000"
],
methods: ["GET", "POST","PUT", "DELETE"],
credentials: true
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/manches', manchesRouter);
app.use('/missionsCampagne', missionsCampagneRouter);
app.use('/quete', queteRouter);

// Ajout pour le générateur des nom de lobbies
app.use('/lobbies', lobbiesRouter);

// Import et appel du gameSocket avec l'instance io
const gameSocket = require('./gamesocket');
gameSocket(io);
server.listen(4000, () => {
  console.log('Serveur Socket.IO démarré sur http://localhost:4000'); // Express sur le port 3000, utilisé un autre
});

module.exports = app;
