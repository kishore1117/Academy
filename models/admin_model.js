const Joi = require('joi');

const itemSchema = Joi.object({
    name: Joi.string().required(),
    unique_id: Joi.string().required(),
});

function validateItem(franchise) {
    return itemSchema.validate(franchise);
}

module.exports = {
    validateItem
};  