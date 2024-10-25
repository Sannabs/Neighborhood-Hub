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
    const { id, reviewId } = req.params;
    const { rating, body } = req.body.review; 

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

    if (review.notHelpfuls.includes(userId)) {
        review.notHelpfuls.pull(userId);
        review.notHelpfulCount -= 1;
    }
    if (review.helpfuls.includes(userId)) {
        review.helpfuls.pull(userId);
        review.helpfulCount -= 1;
    } else {
        review.helpfuls.push(userId);
        review.helpfulCount += 1;
    }

    await review.save();

    if (req.xhr) {
        return res.json({ 
            isHelpful: review.helpfuls.includes(userId), 
            helpfulCount: review.helpfulCount,
            notHelpfulCount: review.notHelpfulCount
        });
    }

    res.redirect(`/neighborhoods/${id}`);
};



module.exports.NotHelpful = async (req, res) => {
    const { id, reviewId } = req.params;
    const userId = req.user._id;
    const review = await Review.findById(reviewId);

    if (review.helpfuls.includes(userId)) {
        review.helpfuls.pull(userId);
        review.helpfulCount -= 1;
    }
    if (review.notHelpfuls.includes(userId)) {
        review.notHelpfuls.pull(userId);
        review.notHelpfulCount -= 1;
    } else {
        review.notHelpfuls.push(userId);
        review.notHelpfulCount += 1;
    }

    await review.save();

    if (req.xhr) {
        return res.json({ 
            isNotHelpful: review.notHelpfuls.includes(userId), 
            helpfulCount: review.helpfulCount, 
            notHelpfulCount: review.notHelpfulCount
            
        });
    }

    res.redirect(`/neighborhoods/${id}`);
};