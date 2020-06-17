const allowedQueryParams = (...allowedParams) => {
    return (req, res, next) => {
        if(!allowedParams) throw 'You must provide at least one allowed parameter';

        const params = Object.keys(req.query);

        const notAllowedParams = params.filter( param => !allowedParams.includes(param) );
        if(notAllowedParams.length) return res.status(400).json({msg: `Illegal query parameter(s): ${notAllowedParams}`});

        next();
    };
};

module.exports = allowedQueryParams;