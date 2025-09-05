const joi = require('joi');

const schema = joi.object({
    TODO: joi.object({
        todo: joi.string().required(),
        description: joi.string().required(),
        isCompleted: joi.boolean()
    }).required()

})

module.exports = schema;