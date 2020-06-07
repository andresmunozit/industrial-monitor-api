const router = require('express').Router();
const auth = require('../../middleware/auth');

const adminRouter = require('./v1/admin');
const userRouter = require('./v1/user');
const telemetryRouter = require('./v1/user');

const User = require('../../models/user');

router.use('/admin', adminRouter);
router.use('/user', userRouter);
router.use('/telemetry', telemetryRouter);

router.post('/login', async (req, res) => { // Test username and password and issue a token
    try {
        const { email, password } = req.body;
        const user = await User.getUserByCredentials(email, password);
        if(!user) return res.status(403).json({msg: 'Wrong credentials'});
        const token = await user.createToken();

        res.json({user, token});
    } catch {
        res.status(500).json();  
    };
});

router.get('/logout', auth, async (req, res) => {
    const user = req.user;
    const token = req.token;
    try{
        await user.deleteToken(token);
        res.json();
    } catch {
        res.status(500).json();
    }
});

module.exports = router;