const router = require('express').Router();
const measurementsRouter = require('./devices/measurements');

app.use(':id/measurements', measurementsRouter);

module.exports = router;