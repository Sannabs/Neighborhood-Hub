const express = require('express');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Neighborhood = require('../models/Neighborhood');
const Review = require('../models/Review')
const review = require('../controllers/Review');


const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const router = express.Router({ mergeParams: true });

//REVIEW CRUD
// creating review
router.post('/', isLoggedIn, validateReview, catchAsync(review.createReview))

router.route('/:reviewId')
    .delete(isLoggedIn, isReviewAuthor, catchAsync(review.deleteReview))
    .put(isLoggedIn, isReviewAuthor, validateReview, catchAsync(review.updateReview));






module.exports = router;