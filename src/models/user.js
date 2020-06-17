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
        maxLenght: [64, 'The email is too long'],
        validate:{
            validator: function(v){
                return validator.isEmail(v);
            },
            message: props => `${props.value} is not a valid email`
        },
    },
    name: {
        type: String,
        required: [true, '"name" is required'],
        trim: true,
        unique: false,
        maxLenght: [100, '"name" is too long']
    },
    lastname: {
        type: String,
        required: [true, '"lastname" is required'],
        trim: true,
        unique: false,
        maxLenght: [100, '"lastname" is too long'],
    },
    password: {
        type: String,
        required: false,
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
    }]}, 
    { 
        timestamps: true,
        collation: { locale: 'en_US', strength: 1 }
    },
);


// Encrypt password
userSchema.pre('save', async function(next){
    const user = this;
    if(!user.isModified('password')) return next();
    user.password = await bcrypt.hash(user.password, 8);
    next();
});

userSchema.statics.ROLE = ROLE;

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
    const token = jwt.sign({_id, iat: Date.now()}, process.env.JWT_SECRET);
    user.tokens.push({token});
    await user.save();
    return token;
};

userSchema.methods.deleteToken = async function(token){
    const user = this;
    const tokenIndex = user.tokens.findIndex( userToken => userToken.token === token );
    if(tokenIndex === -1) throw 'Token doesn\'t exist';
    user.tokens.splice(tokenIndex, 1);
    await user.save();
};

// Validate token: Is the token in the tokens array?
userSchema.methods.validToken = function( token ){
    const user = this;
    const tokenIndex = user.tokens.findIndex( userToken => userToken.token === token );
    return tokenIndex >= 0 ? true : false;
};

const User = mongoose.model( 'User', userSchema );
module.exports = User;