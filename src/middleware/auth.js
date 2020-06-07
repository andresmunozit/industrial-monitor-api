const User = require('../models/user');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader || !authHeader.includes('Bearer ')){
        return res.status(403).json({msg: 'Not authorized'});
    };
    const token = authHeader.split(' ')[1];

    try{
        const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
        const userId = tokenPayload._id;
        
        try{
            const user = await User.findById(userId);
            if( user.validToken(token) ){
                req.user = user;
                req.token = token;
                next();
            } else {
                return res.status(403).json({msg: 'Not authorized'});
            };
        }catch(error){
            res.status(500).json({msg: 'Internal server error'});
        };

    } catch {
        return res.status(403).json({msg: 'Not authorized'});
    };
};

module.exports = auth;