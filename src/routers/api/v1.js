const router = require('express').Router();

const adminRouter = require('./v1/admin');
const userRouter = require('./v1/user');
const telemetryRouter = require('./v1/user');

router.use('/admin', adminRouter);
router.use('/user', userRouter);
router.use('/telemetry', telemetryRouter);

module.exports = router;