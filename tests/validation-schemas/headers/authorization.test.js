const { bearerTokenSchema } = require('../../../src/validation-schemas/headers/authorization');
const faker = require('faker');

it('Should validate a valid token format', () => {
    const header = {
        'authorization':`Bearer ${faker.random.alphaNumeric(120)}`
    };
    const { error } = bearerTokenSchema.validate(header);
    expect(error).toBeUndefined();
});

it('Should not validate an invalid token format', () => {
    const header1 = {
        'authorization':`       Bearer ${faker.random.alphaNumeric(120)}`
    };
    const { error: error1 } = bearerTokenSchema.validate(header1);
    expect(error1).toBeDefined();

    const header2 = {
        'authorization':`${faker.random.alphaNumeric(120)}`
    };
    const { error: error2 } = bearerTokenSchema.validate(header2);
    expect(error2).toBeDefined();
});

it('Should not allow headers without the presence of Authorization header', () => {
    const header1 = {
        'Content-Type': 'application/json',
        'Date': 'Fri, 22 Jan 2010 04:00:00 GMT'
    };
    const { error: error1 } = bearerTokenSchema.validate(header1);
    expect(error1).toBeDefined();
});

describe('If the token header is correct', () => {
    it('Should ignore other headers', () => {
        const header1 = {
            'authorization':`Bearer ${faker.random.alphaNumeric(120)}`,
            'Content-Type': 'application/json'
        };
        const { error: error1 } = bearerTokenSchema.validate(header1);
        expect(error1).toBeUndefined();
    });
});


