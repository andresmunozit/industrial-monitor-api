const allowedBodyParams = (...allowedParams) => {
    return (req, res, next) => {
        if(!allowedParams) throw 'You must provide at least one allowed parameter';

        const params = Object.keys(req.body);

        if( !params.every( param => allowedParams.includes(param) )) {
            return res.status(400).json({msg: 'Illegal body parameters'});
        };

        req.allowedBodyParams = allowedParams;

        next();
    };
};

module.exports = allowedBodyParams;