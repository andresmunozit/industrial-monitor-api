const router = require('express').Router();
const measurementsRouter = require('./devices/measurements.js');
const alarmsRouter = require('./devices/alarms')

router.use(':id/measurements', measurementsRouter);
router.use(':id/alarms', alarmsRouter);

module.exports = router;