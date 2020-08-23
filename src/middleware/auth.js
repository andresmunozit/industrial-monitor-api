const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { bearerTokenSchema } = require('../validation-schemas/headers/authorization');

const auth = async (req, res, next) => {
    const { error } = bearerTokenSchema.validate(req.headers);
    if(error) return res.status(403).json({msg: 'Not authorized'})

    const token = req.get('Authorization').split(' ')[1];

    try{
        const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
        const userId = tokenPayload._id;
        
        try{
            const user = await User.findById(userId);
            if( !user.validToken(token) ) return res.status(403).json({msg: 'Not authorized'});
            req.user = user;
            req.token = token;
            next();
        }catch(error){
            res.status(500).json({msg: 'Internal server error'});
        };

    } catch {
        return res.status(403).json({msg: 'Not authorized'});
    };
};

module.exports = auth;