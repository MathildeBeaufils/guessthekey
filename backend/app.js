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



const allowedOrigins = [
"https://guessthekey.vercel.app", // ton frontend Vercel
"https://guessthekey.onrender.com",
"http://localhost:4000" // pour dev local
];

app.use(cors({
origin: function (origin, callback) {
if (!origin || allowedOrigins.includes(origin)) {
callback(null, true);
} else {
callback(new Error("Not allowed by CORS"));
}
},
methods: ["GET", "POST"],
credentials: true
}));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/manches', manchesRouter);
app.use('/missionsCampagne', missionsCampagneRouter);
app.use('/quete', queteRouter);

// Ajout pour le générateur des nom de lobbies
app.use('/lobbies', lobbiesRouter);

// Import et appel du gameSocket avec l'instance io
const gameSocket = require('./gamesocket');
// const port = process.env.PORT || 4000;
gameSocket(io);
// server.listen(port || 4000, () => {
//   console.log(`Serveur Socket.IO démarré sur ${port}`); 
// });


module.exports = app;
