const mongoose = require('mongoose');

const connectionString = process.env.CONNECTION_STRING;

// Bloque la connection à la DB lorsque qu'un TDD est fait avec Jest.
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
    .then(() => console.log('Database connected'))
    .catch(error => console.error(error));
}

// mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
//   .then(() => console.log('Database connected'))
//   .catch(error => console.error(error));

module.exports = connectionString;
