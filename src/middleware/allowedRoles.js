const allowedRoles = ( ...roles ) => {
    return (req, res, next) => {
        if(roles.includes(req.user.role)){
            next();
        } else {
            res.status(403).json({msg: 'Not authorized'});
        };
    };
};

module.exports = allowedRoles;