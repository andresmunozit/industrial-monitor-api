const router = require('express').Router();
const devicesRouter = require('./users/devices');
const mongoose = require('mongoose');
const sendEmail = require('../../../../helpers/email/sendEmail');
const User = require('../../../../models/user');
const allowedBodyParams = require('../../../../middleware/allowedBodyParams');
const allowedQueryParams = require('../../../../middleware/allowedQueryParams');
const validateQuery = require('../../../../middleware/validateQuery');
const { welcome, resetPassword } = require('../../../../helpers/email/emailTemplates');
const checkId = require('../../../../middleware/checkId');


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

router.get('/:id', checkId, async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json(); // null
        res.json(user);
    } catch(error) { // Bad id format, errors with the database
        res.status(500).json();
    };
});

router.post('/', allowedBodyParams('name', 'lastname', 'email', 'role'), async (req, res) => {
    try{
        const user = new User(req.body);
        const temporaryPassword = user.generateTemporaryPassword();
        await user.save();
        res.status(201).json(user);
        const welcomeTemplate = welcome(user.email, user.name, temporaryPassword);
        sendEmail(welcomeTemplate); // No need for await
    } catch(error) {
        if(error.code === 11000) res.status(400).json({msg: 'The email already exists'}); // Since email is the only unique allowed parameter
        if(error.errors){
            const messages = Object.keys(error.errors).map( errorField => ({msg: error.errors[errorField].properties.message}) );
            return res.status(400).json(messages);
        };
        res.status(500).json();
    };
});

router.patch('/:id', checkId, allowedBodyParams('name', 'lastname', 'email', 'role'), allowedQueryParams('resetPassword'), async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json(); // null

        let temporaryPassword;
        if (req.query.resetPassword === 'true') temporaryPassword = user.generateTemporaryPassword();

        req.allowedBodyParams.forEach( param => user[`${param}`] = req.body[`${param}`]);

        await user.save();
        res.json(user);

        if (req.query.resetPassword === 'true'){
            const resetPasswordTemplate = resetPassword(user.email, user.name, temporaryPassword);
            sendEmail(resetPasswordTemplate);
        };
    } catch (error) {
        if(error.code === 11000) res.status(400).json({msg: 'The email already exists'});
        res.status(500).json();
    };
});

router.delete('/:id', checkId, async (req, res) => {
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