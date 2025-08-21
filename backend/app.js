require('dotenv').config();
require('./models/connection');
var express = require('express');
var app = express();

const mongoose = require('mongoose');
const cors = require('cors');

// ajout pour les lobbies
// (Suppression de la création du serveur HTTP et de Socket.io ici)
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
  "https://guessthekey.vercel.app",
  "https://guessthekey.onrender.com",
  "http://localhost:4000"
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

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/manches', manchesRouter);
app.use('/missionsCampagne', missionsCampagneRouter);
app.use('/quete', queteRouter);

// Ajout pour le générateur des nom de lobbies
app.use('/lobbies', lobbiesRouter);




module.exports = { app, server };
