const allowedQueryParams = (...allowedParams) => {
    if(allowedParams.length === 0) throw 'You must provide at least one allowed parameter';
    return (req, res, next) => {
        const params = Object.keys(req.query);
        const notAllowedParams = params.filter( param => !allowedParams.includes(param) );
        if(notAllowedParams.length) return res.status(400).json({msg: `Illegal query parameter(s): ${notAllowedParams.join(', ')}.`});
        next();
    };
};

module.exports = allowedQueryParams;