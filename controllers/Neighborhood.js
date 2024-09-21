const express = require('express');
const Neighborhood = require('../models/Neighborhood')
const { cloudinary } = require('../cloudinary/index');
// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const mapBoxToken = process.env.MAPBOX_TOKEN;
const fetch = require('node-fetch');
const googleMapsAPIKey = process.env.GOOGLE_MAPS_API_KEY;
// const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const neighborhoods = await Neighborhood.find({})
    res.render('hoods/index', { neighborhoods })
}


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

    const {lat, lng} = geoData.results[0].geometry.location;

    const neighborhood = new Neighborhood(req.body.neighborhood)
    neighborhood.geometry = {
        type: 'Point',
        coordinates: [lng, lat] 
    };
    neighborhood.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    neighborhood.author = req.user._id;
    await neighborhood.save();
    console.log(neighborhood.geometry.coordinates)
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

