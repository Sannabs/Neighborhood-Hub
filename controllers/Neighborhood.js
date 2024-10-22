const express = require('express');
const Neighborhood = require('../models/Neighborhood')
const { cloudinary } = require('../cloudinary/index');
// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const mapBoxToken = process.env.MAPBOX_TOKEN;
const fetch = require('node-fetch');
const googleMapsAPIKey = process.env.GOOGLE_MAPS_API_KEY;
// const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {

    const neighborhoods = await Neighborhood.find({}).populate({
        path: 'reviews'
    })

    neighborhoods.forEach(neighborhood => {
        if (neighborhood.reviews.length > 0) {
            const avgRating = neighborhood.reviews.reduce((sum, review) => sum + review.rating, 0) / neighborhood.reviews.length;
            neighborhood.avgRating = avgRating;
        } else {
            neighborhood.avgRating = 0
        }
    })
    res.render('hoods/index', { neighborhoods })
}

module.exports.popular = async (req, res) => {
    const neighborhoods = await Neighborhood.find({}).populate({
        path: 'reviews'
    })

    neighborhoods.forEach(neighborhood => {
        if (neighborhood.reviews.length > 0) {
            const avgRating = neighborhood.reviews.reduce((sum, review) => sum + review.rating, 0) / neighborhood.reviews.length
            neighborhood.avgRating = avgRating;
        } else {
            neighborhood.avgRating = 0
        }

    })
    const topRating = neighborhoods.sort((a, b) => b.avgRating - a.avgRating).slice(0, 20)
    res.render('hoods/popular', { topRating })
}

module.exports.showFavouriteNeighborhoods = async (req, res) => {
    const userId = req.user._id;
    const favouriteNeighborhoods = await Neighborhood.find({
        favourites: userId
    }).populate({
        path: 'reviews'
    });

    favouriteNeighborhoods.forEach(neighborhood => {
        if (neighborhood.reviews.length > 0) {
            const avgRating = neighborhood.reviews.reduce((sum, review) => sum + review.rating, 0) / neighborhood.reviews.length;
            neighborhood.avgRating = avgRating;
        } else {
            neighborhood.avgRating = 0;
        }
    });

    if (favouriteNeighborhoods.length > 0) {
        res.render('hoods/favourites', { favouriteNeighborhoods });
    } else {
        res.render('hoods/nofavourites');
    }
};


module.exports.renderNewForm = (req, res) => {
    res.render('hoods/new')
}

module.exports.createNeighborhood = async (req, res) => {

    const location = `${req.body.neighborhood.location} The Gambia`;
    const geoDataResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${googleMapsAPIKey}`);
    const geoData = await geoDataResponse.json();

    if (geoData.status !== 'OK') {
        req.flash('error', 'Could not find location');
        return res.redirect('/neighborhoods/new');
    }

    const { lat, lng } = geoData.results[0].geometry.location;

    const neighborhood = new Neighborhood(req.body.neighborhood)
    neighborhood.geometry = {
        type: 'Point',
        coordinates: [lng, lat]
    };
    neighborhood.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    neighborhood.author = req.user._id;
    await neighborhood.save();
    req.flash('success', 'Successfully made a new neighborhood!')
    res.redirect(`/neighborhoods/${neighborhood._id}`)
}

module.exports.showNeighborhood = async (req, res) => {
    const { id } = req.params
    const neighborhood = await Neighborhood.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    res.render('hoods/show', { neighborhood })

}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const neighborhood = await Neighborhood.findById(id)
    if (!neighborhood) {
        req.flash('error', 'Cannot find that neighborhood!')
        return res.redirect('/neighborhoods')
    }
    res.render('hoods/edit', { neighborhood })
}

module.exports.updateNeighborhood = async (req, res) => {
    const { id } = req.params
    const neighborhood = await Neighborhood.findByIdAndUpdate(id, { ...req.body.neighborhood }, { new: true })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    neighborhood.images.push(...imgs)
    await neighborhood.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await neighborhood.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully Updated the neighborhood!')
    res.redirect(`/neighborhoods/${neighborhood._id}`)
}

module.exports.deleteNeighborhood = async (req, res) => {
    const { id } = req.params
    const neighborhood = await Neighborhood.findByIdAndDelete(id)
    req.flash('success', 'Neighborhood deleted successfully!')
    res.redirect(`/neighborhoods`)
}


module.exports.Favourites = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    const neighborhood = await Neighborhood.findById(id);

    let isFavourited;

    if (neighborhood.favourites.includes(userId)) {
        neighborhood.favourites.pull(userId);
        isFavourited = false;
    } else {
        neighborhood.favourites.push(userId);
        isFavourited = true;
    }

    await neighborhood.save();

    if (req.xhr) {
        return res.json({ isFavourited });
    }

    res.redirect('/neighborhoods');
};
