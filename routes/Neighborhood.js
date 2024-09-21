const express = require('express');
const catchAsync = require('../utils/catchAsync');

const ExpressError = require('../utils/ExpressError');
const { validateNeighborhood, isLoggedIn, isAuthor } = require('../middleware');
const Neighborhood = require('../models/Neighborhood')
const neighborhood = require('../controllers/Neighborhood')

const router = express.Router();

const { storage } = require('../cloudinary/index');
const { cloudinary } = require('../cloudinary/index');


const multer = require('multer');
const upload = multer({ storage })

// NEIGHBORHOOD CRUD

// HANDLES THE INDEX PAGE AKA LANDING PAGE FOR ME:

router.route('/')
    .get(catchAsync(neighborhood.index))
    .post(isLoggedIn, upload.array('image'), validateNeighborhood, catchAsync(neighborhood.createNeighborhood))


// ADD NEW
router.get('/new', isLoggedIn, neighborhood.renderNewForm)


// SHOW PAGE
router.route('/:id')
    .get(catchAsync(neighborhood.showNeighborhood))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateNeighborhood, catchAsync(neighborhood.updateNeighborhood))
    .delete(isLoggedIn, isAuthor, catchAsync(neighborhood.deleteNeighborhood))


// UPDATING
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(neighborhood.renderEditForm))



module.exports = router;