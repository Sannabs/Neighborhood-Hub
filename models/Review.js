const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    helpfuls: [{
        type: Schema.Types.ObjectId,
        ref: 'User'  // Array of users who liked the review
    }],
    helpfulCount: {
        type: Number,
        default: 0
    },
    notHelpfuls: [{
        type: Schema.Types.ObjectId,
        ref: 'User'  // Array of users who disliked the review
    }],
    notHelpfulCount: {
        type: Number,
        default: 0
    }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
