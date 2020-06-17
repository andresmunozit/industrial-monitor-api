const allowedBodyParams = (...allowedParams) => {
    return (req, res, next) => {
        if(!allowedParams) throw 'You must provide at least one allowed parameter';

        const params = Object.keys(req.body);

        const notAllowedParams = params.filter( param => !allowedParams.includes(param) );
        if(notAllowedParams.length) return res.status(400).json({msg: `Illegal body parameter(s): ${notAllowedParams}`});

        req.allowedBodyParams = allowedParams;

        next();
    };
};

module.exports = allowedBodyParams;