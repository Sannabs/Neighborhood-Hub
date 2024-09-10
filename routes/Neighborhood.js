const express = require('express');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { validateNeighborhood, isLoggedIn, isAuthor } = require('../middleware');
const Neighborhood = require('../models/Neighborhood')
const router = express.Router();


// NEIGHBORHOOD CRUD

// HANDLES THE INDEX PAGE AKA LANDING PAGE FOR ME:

router.get('/', catchAsync(async (req, res) => {
    const neighborhoods = await Neighborhood.find({})
    res.render('hoods/index', { neighborhoods })
}))

// ADD NEW
router.get('/new', isLoggedIn, (req, res) => {
    res.render('hoods/new')
})

router.post('/', isLoggedIn, validateNeighborhood, catchAsync(async (req, res) => {
    const neighborhood = new Neighborhood(req.body.neighborhood)
    neighborhood.author = req.user._id;
    await neighborhood.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/neighborhoods/${neighborhood._id}`)
}))

// SHOW PAGE
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const neighborhood = await Neighborhood.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    res.render('hoods/show', { neighborhood })
}))

// UPDATING
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    const neighborhood = await Neighborhood.findById(id)
    if (!neighborhood) {
        req.flash('error', 'Cannot find that neighborhood!')
        return res.redirect('/neighborhoods')
    }
    res.render('hoods/edit', { neighborhood })
}))

router.put('/:id', isLoggedIn, isAuthor, validateNeighborhood, catchAsync(async (req, res) => {
    const { id } = req.params
    const neighborhood = await Neighborhood.findByIdAndUpdate(id, { ...req.body.neighborhood }, { new: true })
    await neighborhood.save()
    req.flash('success', 'Successfully Updated the neighborhood!')
    res.redirect(`/neighborhoods/${neighborhood._id}`)
}))

// DELETING SOMETHING
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    const neighborhood = await Neighborhood.findByIdAndDelete(id)
    res.redirect(`/neighborhoods`)
}))


module.exports = router;