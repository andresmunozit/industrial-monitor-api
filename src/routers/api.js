const router = require('express').Router();
const v1Router = require('./api/v1');

router.use('/v1', v1Router);

module.exports = router;