const router = require('express').Router();
const devicesRouter = require('./users/devices');
const User = require('../../../../models/user');
const mongoose = require('mongoose');
const allowedBodyParams = require('../../../../middleware/allowedBodyParams');
const allowedQueryParams = require('../../../../middleware/allowedQueryParams');
const validateQuery = require('../../../../middleware/validateQuery');

router.use(':id/devices', devicesRouter);

const getUsersAllowedFields = ['name', 'lastname', 'email', 'role'];

router.get('/',  allowedQueryParams('filter','sort','limit','skip'), validateQuery(getUsersAllowedFields), async (req, res) => {
    const { filter, sort, limit, skip } = req.validatedQuery;

    try{
        const users = await User.find(filter)
            .sort(sort)
            .limit(limit)
            .skip(skip);

        res.json(users);
    } catch(error) {
        res.status(500).json();
    };
});

router.get('/:id', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json(); // null
        res.json(user);
    } catch(error) { // Bad id format, errors with the database
        if(error.kind){
            if(error.kind === 'ObjectId') res.status(400).json({msg: 'Wrong ID format'});
        };
        res.status(500).json();
    };
});

router.post('/', allowedBodyParams('name', 'lastname', 'email', 'role'), async (req, res) => {
    try{
        const user = new User(req.body);
        await user.save();
        res.json(user);
    } catch(error) {
        console.log(error.errors);
        if(error.code === 11000) res.status(400).json({msg: 'The email already exists'}); // Since email is the only unique allowed parameter
        if(error.errors){
            const messages = Object.keys(error.errors).map( errorField => ({msg: error.errors[errorField].properties.message}) );
            return res.status(400).json(messages);
        };
        res.status(500).json();
    };
});

router.patch('/:id', allowedBodyParams('name', 'lastname', 'email', 'role'), async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json(); // null

        req.allowedBodyParams.forEach( param => user[`${param}`] = req.body[`${param}`]);

        await user.save();

        res.json(user);
    } catch (error) {
        console.log(error);
        if(error.code === 11000) res.status(400).json({msg: 'The email already exists'});
        res.status(500).json();
    };
});

router.delete('/:id', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json(); // null

        await User.deleteOne({_id: user._id});

        res.json(); 
    } catch(error){
        res.status(500).json();
    };
});

module.exports = router;