const allowedBodyParams = (...allowedParams) => {
    if(allowedParams.length === 0) throw 'You must provide at least one allowed parameter';
    if(allowedParams.join('').includes(' ')) throw 'Allowed body parameters cannot contain spaces';
    if(allowedParams.join('').match(/[$-/:-?{-~!"^_`\[\]]/)) throw 'Allowed body parameters cannot contain special characters';

    return (req, res, next) => {

        const params = Object.keys(req.body);

        const notAllowedParams = params.filter( param => !allowedParams.includes(param) );
        if(notAllowedParams.length) return res.status(400).json({msg: `Illegal body parameter(s): ${notAllowedParams.join(', ')}`});

        req.allowedBodyParams = allowedParams;

        next();
    };
};

module.exports = allowedBodyParams;