const express = require('express');
require('./db/mongoose'); // Mongoose configuration (connection and parameters)

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routers
const apiRouter = require('./routers/api'); 
app.use('/api', apiRouter);

app.get('/', (req, res) => {
    res.json("App running...");
});

module.exports = app;