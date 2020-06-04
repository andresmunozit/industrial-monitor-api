const router = require('express').Router();

const usersRouter = require('./user/users');
const devicesRouter = require('./user/devices');

router.use('/users', usersRouter);
router.use('/devices', devicesRouter);

module.exports = router;