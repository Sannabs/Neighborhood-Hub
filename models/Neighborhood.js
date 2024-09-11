const mongoose = require('mongoose');
const Review = require('./Review');
const { Schema } = mongoose;


const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } }


const HoodSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    images: [ImageSchema],
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
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
    businesses: [String],
    cordinates: {
        type: [Number]
        // required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author:
    {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

}, opts);


HoodSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


const Hood = mongoose.model('Hood', HoodSchema);
module.exports = Hood;
