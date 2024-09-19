const Joi = require('joi');

module.exports.HoodSchema = Joi.object({
    neighborhood: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().allow(''),  // Optional
        schools: Joi.array().items(Joi.string().allow('')).optional(),  // Optional and can be empty
        transport: Joi.array().items(Joi.string().allow('')).optional(),  // Optional and can be empty
        safety: Joi.string().valid('safe', 'unsafe').required(),
        population: Joi.number().min(0),
        businesses: Joi.array().items(Joi.string().allow('')).optional(),  // Optional and can be empty
        cordinates: Joi.array().items(Joi.number())  // Optional array of numbers (for coordinates)
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required()  // Added `required` to enforce this field
    }).required()
});
