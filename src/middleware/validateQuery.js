const validateFilter = filter => filter || {};

const validateSort = sort => {
    if(!sort) return {};

    const allowedSortValues = ['-1', '1'];

    const sortedFields = Object.keys(sort);
    for (let i = 0; i < sortedFields.length; i++) { // forEach doesn't return from the entire function but just from its callback, so for loop is used
        const sortedField = sortedFields[i];
        if( !allowedSortValues.includes(sort[sortedField]) ) return {};
    };

    return sort;
};

const validateQuery = (req, res, next) => {
    req.validatedQuery = {};
    req.validatedQuery.filter = validateFilter(req.query.filter);
    req.validatedQuery.sort = validateSort(req.query.sort);

    next();
};

module.exports = validateQuery;