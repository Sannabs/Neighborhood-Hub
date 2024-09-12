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
