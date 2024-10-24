const BaseJoi = require('joi')
const sanitizeHtml = require('sanitize-html')
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean
            }
        }
    }
})



const Joi = BaseJoi.extend(extension);

module.exports.HoodSchema = Joi.object({
    neighborhood: Joi.object({
        title: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        description: Joi.string().allow('').escapeHTML(),  // Optional
        schools: Joi.array().items(Joi.string().allow('').escapeHTML()).optional(),  // Optional and can be empty
        transport: Joi.array().items(Joi.string().allow('').escapeHTML()).optional(),  // Optional and can be empty
        safety: Joi.string().valid('safe', 'unsafe').required().escapeHTML(),
        population: Joi.number().min(0),
        businesses: Joi.array().items(Joi.string().allow('').escapeHTML()).optional(),  // Optional and can be empty
        coordinates: Joi.array().items(Joi.number())  // Optional array of numbers (for coordinates)
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().min(1).max(5).required()  // Added `required` to enforce this field
    }).required()
});
