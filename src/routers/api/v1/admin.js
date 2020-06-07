const router = require('express').Router();

const usersRouter = require('./admin/users');
const devicesRouter = require('./admin/devices');
const auth = require('../../../middleware/auth');
router.use(auth);  // All /api/v1/admin/ endpoints are authenticated

router.use('/users', usersRouter);
router.use('/devices', devicesRouter);

module.exports = router;