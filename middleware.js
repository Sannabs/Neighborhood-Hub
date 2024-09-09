const { HoodSchema, reviewSchema } = require('./Schema.js')
const ExpressError = require('./utils/ExpressError.js');
const Neighborhood = require('./models/Neighborhood')
const Review = require('./models/Review')



module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}




module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const neighborhood = await Neighborhood.findById(id)
    if (!neighborhood.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/neighborhoods/${id}`)
    }
    next()
}


module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/neighborhoods/${id}`)
    }
    next();
}




// CAMPGROUND SERVER SIDE VALIDATOIN WITH JOI
module.exports.validateNeighborhood = (req, res, next) => {
    const { error } = HoodSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'you must be signed in first!')
        return res.redirect('/login')
    }
    next();
}


// REVIEW SERVER SIDE VALIDATOIN WITH JOI
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }

}