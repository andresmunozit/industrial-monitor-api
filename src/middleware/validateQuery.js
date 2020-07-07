const ALLOWED_FILTER_QUERY_OPERATORS = ['$eq', '$gt', '$in', '$lt', '$ne', '$lte','$gte','$nin','$regex'];
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

const validateFields = (object, allowedFields) => {
    if (!object) return {};
    const objectFields = Object.keys(object);
    const notAllowedFields = objectFields.filter( objectField => !allowedFields.includes(objectField) );
    if(notAllowedFields.length) return {error: `Not allowed field(s): ${notAllowedFields.join(', ')}.`}
    return object;
};

const validateFilterQueryOperators = (filter, allowedOperators) => {
    if (!filter) return {};
    let notAllowedOperators = [];
    for(const field in filter){
        if(typeof filter[field] === 'string') break;
        const fieldOperators = Object.keys(filter[field]);
        const fieldNotAllowedOperators = fieldOperators.filter( operator => !allowedOperators.includes(operator));
        notAllowedOperators = [...notAllowedOperators, ...fieldNotAllowedOperators];
    };
    if(notAllowedOperators.length) return {error: `Not allowed operator(s): ${notAllowedOperators.join(', ')}.`};
    return filter;
};

const validateSortValues = sort => {
    if (!sort) return {};
    for(const field in sort){
        if(!parseInt(Number(sort[field]))) return {error: `Sort can be equals to -1, 0 or 1. Instead "${sort[field]}" was received for field "${field}".`};
        if(sort[field] < -1 || sort[field] > 1) return {error: `Sort can be equals to -1, 0 or 1. Instead "${sort[field]}" was received for field "${field}".`};
        sort[field] = parseInt(sort[field]);
    };
    return sort;
};

const validateLimit = (limit, maxLimit) => {
    if (!limit) return DEFAULT_LIMIT;
    if (!parseInt(Number(limit))) return {error: `"limit" must be a positive integer, "${limit}" received instead.`};
    if (limit < 0 || limit > maxLimit) return {error: `"limit" must be an integer between 0 and ${maxLimit}, "${limit}" received instead.`};
    return parseInt(limit);
};

const validateSkip = skip => {
    if (!skip) return 0;
    if (!parseInt(Number(skip))) return {error: `"skip" must be a positive integer, "${skip}" received instead.`};
    console.log('SKIP', skip)
    if (skip < 0 || skip > Math.pow(2, 31)) return {error: `"skip" must be an integer between 0 and 2^31, "${skip}" received instead.`};
    return parseInt(skip);
};

const validateQuery = (allowedFields, allowedFilterQueryOperators = ALLOWED_FILTER_QUERY_OPERATORS, maxLimit = MAX_LIMIT) => {
    return (req, res, next) => {
        let filter, sort, skip, limit;

        filter = validateFields(req.query.filter, allowedFields);
        if (filter.error) return res.status(400).json({msg: `${filter.error} "filter" parameter validation.`});

        filter = validateFilterQueryOperators(req.query.filter, allowedFilterQueryOperators);
        if (filter.error) return res.status(400).json({msg: `${filter.error} "filter" parameter validation.`});

        sort = validateFields(req.query.sort, allowedFields);
        if (sort.error) return res.status(400).json({msg: `${sort.error} "sort" parameter validation.`});

        sort = validateSortValues(req.query.sort);
        if (sort.error) return res.status(400).json({msg: `${sort.error} "sort" parameter validation.`});

        limit = validateLimit(req.query.limit, maxLimit);
        if (limit.error) return res.status(400).json({msg: `${limit.error} "limit" parameter validation.`});

        skip = validateSkip(req.query.skip);
        if (skip.error) return res.status(400).json({msg: `${skip.error} "skip" parameter validation.`})

        req.validatedQuery = { filter, sort, skip, limit };

        next();
    };
};

module.exports = {
    validateQuery,
    ALLOWED_FILTER_QUERY_OPERATORS
};