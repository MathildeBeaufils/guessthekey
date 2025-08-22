require('dotenv').config();
require('./models/connection');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();

// CORS
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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const manchesRouter = require('./routes/manches');
const queteRouter = require('./routes/quete');
const missionsCampagneRouter = require('./routes/missionCampagne');
const lobbiesRouter = require('./routes/lobbies');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/manches', manchesRouter);
app.use('/missionsCampagne', missionsCampagneRouter);
app.use('/quete', queteRouter);
app.use('/lobbies', lobbiesRouter);

module.exports = app;
