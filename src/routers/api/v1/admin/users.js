const router = require('express').Router();
const devicesRouter = require('./users/devices');

router.use(':id/devices', devicesRouter);

// Users routes

module.exports = router;