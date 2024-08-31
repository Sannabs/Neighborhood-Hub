const mongoose = require('mongoose');
const { Schema } = mongoose;

const HoodSchema = new Schema({
    name: {
        type: String,
        required: true 
    },
    location: {
        type: String,
        required: true 
    },
    price: {
        type: Number,
        min: 0 
    },
    description: {
        type: String
    },
    schools: [String], 
    transport: [String], 
    safety: {
        type: String,
        enum: ['safe', 'unsafe'],
        required: true 
    },
    population: {
        type: Number,
        min: 0 
    },
    businesses: [String] ,
    cordinates: {
        type: [Number]
    }
});

const Hood = mongoose.model('Hood', HoodSchema);

module.exports = Hood;
