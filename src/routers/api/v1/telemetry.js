const router = require('express').Router();
const devicesRouter = require('./telemetry/devices')

app.use('/devices', devicesRouter);

module.exports = router;