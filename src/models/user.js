const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const ROLE = {
    ADMIN: 'admin',
    USER: 'user'
};

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        maxLenght: [64, 'The email is too long']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        unique: false,
        maxLenght: [1000, 'The name is too long']
    },
    lastname: {
        type: String,
        required: [true, 'Lastname is required'],
        trim: true,
        unique: false,
        maxLenght: [1000, 'The lastname is too long'],
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true
    },
    role: {
        type: String,
        required: true,
        enum: [ROLE.ADMIN, ROLE.USER],
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {timestamps: true});


// Encrypt password
userSchema.pre('save', async function(next){
    const user = this;
    if(!user.isModified('password')) return next();
    user.password = await bcrypt.hash(user.password, 8);
    next();
});

// Find user with credentials
userSchema.statics.getUserByCredentials = async function(email, password) {
    try{
        const user = await User.findOne({email});
        if(!user) return null;
        const rightCredentials = await bcrypt.compare( password, user.password )
        return rightCredentials ? user : null;
    } catch(error) {
        return {error};
    };
};

// Define to JSON to reformat user
userSchema.methods.toJSON = function(){
    const { _id, email, name, lastname, role } = this;
    return { _id, email, name, lastname, role };
};

// Create token
userSchema.methods.createToken = async function(){
    const user = this;
    const _id = this._id;
    const token = jwt.sign({_id}, process.env.JWT_SECRET);
    user.tokens.push({token});
    await user.save();
    return token;
};

const User = mongoose.model( 'User', userSchema );
module.exports = User;