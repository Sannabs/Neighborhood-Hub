const Review = require('../models/Review')
const Neighborhood = require('../models/Neighborhood');




module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const neighborhood = await Neighborhood.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id;
    neighborhood.reviews.push(review)
    await review.save()
    neighborhood.save();
    req.flash('success', 'Review Added!')
    res.redirect(`/neighborhoods/${neighborhood._id}`)
}


module.exports.updateReview = async (req, res) => {
    console.log(req.body)
    const { id, reviewId } = req.params;
    const { rating, body } = req.body.review;  // Use req.body.review to match the form structure

    // Update the review
    const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        { rating, body },
        { new: true }
    );
    req.flash('success', 'Review updated!')
    res.redirect(`/neighborhoods/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Neighborhood.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Review deleted successfully!')
    res.redirect(`/neighborhoods/${id}`)
}


module.exports.Helpful = async (req, res) => {
    const { id, reviewId } = req.params;
    const userId = req.user._id;
    const review = await Review.findById(reviewId);
    // Check if user has disliked the review
    if (review.notHelpfuls.includes(userId)) {
        // Remove dislike if user likes the review
        review.notHelpfuls.pull(userId);
        review.notHelpfulCount -= 1;
    }
    // Toggle like status
    if (review.helpfuls.includes(userId)) {
        // User has already liked the review, so remove the like
        review.helpfuls.pull(userId);
        review.helpfulCount -= 1;
    } else {
        // User has not liked the review, so add the like
        review.helpfuls.push(userId);
        review.helpfulCount += 1;
    }
    await review.save();
    res.redirect(`/neighborhoods/${id}`);
}




module.exports.NotHelpful = async (req, res) => {
    const { id, reviewId } = req.params;
    const userId = req.user._id;
    const review = await Review.findById(reviewId);
    // Check if user has liked the review
    if (review.helpfuls.includes(userId)) {
        // Remove like if user dislikes the review
        review.helpfuls.pull(userId);
        review.helpfulCount -= 1;
    }
    // Toggle dislike status
    if (review.notHelpfuls.includes(userId)) {
        // User has already disliked the review, so remove the dislike
        review.notHelpfuls.pull(userId);
        review.notHelpfulCount -= 1;
    } else {
        // User has not disliked the review, so add the dislike
        review.notHelpfuls.push(userId);
        review.notHelpfulCount += 1;
    }
    await review.save();
    res.redirect(`/neighborhoods/${id}`);
}
