const { Joi } = require('celebrate');

const bearerTokenSchema = Joi.object({
    authorization: Joi.string().pattern(/^Bearer */).required(),
}).unknown()

module.exports = {
    bearerTokenSchema,
};