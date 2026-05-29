const express = require('express');
const alumnosRoutes = require('./routes/alumnos.routes');
const profesoresRoutes = require('./routes/profesores.routes');

const app = express();

app.use(express.json());

app.use('/alumnos', alumnosRoutes);
app.use('/profesores', profesoresRoutes);

module.exports = app;
