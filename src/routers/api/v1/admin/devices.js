const router = require('express').Router();
const variablesRouter = require('./devices/variables');

router.use(':id/variables', variablesRouter);

// Devices routes

module.exports = router;