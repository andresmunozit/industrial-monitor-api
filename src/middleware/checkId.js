const ObjectId = require('mongoose').Types.ObjectId;

const checkId = (req, res, next) => {
    const id = req.params.id;
    if(id){
        try{
            new ObjectId(id);
        } catch {
            return res.status(404).json();
        }
    };
    next();
};

module.exports = checkId;