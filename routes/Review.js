const express = require('express');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Neighborhood = require('../models/Neighborhood');
const Review = require('../models/Review')

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const router = express.Router({ mergeParams: true });

//REVIEW CRUD
// creating review
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const neighborhood = await Neighborhood.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id;
    neighborhood.reviews.push(review)
    await review.save()
    neighborhood.save();
    req.flash('success', 'Review Added!')
    res.redirect(`/neighborhoods/${neighborhood._id}`)
}))
router.put('/:reviewId', isLoggedIn, isReviewAuthor, validateReview, catchAsync(async (req, res) => {
    console.log(req.body)
    const { id, reviewId } = req.params;
    const { rating, body } = req.body.review;  // Use req.body.review to match the form structure

    // Update the review
    const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        { rating, body },
        { new: true }
    );
    res.redirect(`/neighborhoods/${id}`);
}));


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Neighborhood.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/neighborhoods/${id}`)
}))




module.exports = router;