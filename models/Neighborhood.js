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
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }

    },
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


// // on the map  only if i were showing the map on the index page. but since it is the showpage only then i dont need it
HoodSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/neighborhoods/${this._id}">${this.location}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
});


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
