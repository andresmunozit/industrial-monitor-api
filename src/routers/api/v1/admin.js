const router = require('express').Router();

const usersRouter = require('./admin/users');
const devicesRouter = require('./admin/devices');

router.use('/users', usersRouter);
router.use('/devices', devicesRouter);

module.exports = router;