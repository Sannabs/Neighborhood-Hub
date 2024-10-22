const express = require('express');
const Neighborhood = require('../models/Neighborhood')

module.exports.home = (req, res) => {
    res.render("home.ejs")
}

module.exports.search = async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.json([]);
    }
    try {
        const neighborhoods = await Neighborhood.find({
            $or: [
                { location: { $regex: query, $options: 'i' } },
                { title: { $regex: query, $options: 'i' } }
            ]
        }).select('_id title location').limit(10);
        res.json(neighborhoods);
    } catch (e) {
        res.status(500).send('SERVER ERROR');
        console.error(e)
    }
}



module.exports.about = (req, res) => {
    res.render('info/about'); 
}

module.exports.privacy = (req, res) => {
    res.render('info/privacy');
}

module.exports.contact = (req, res) => {
    res.render('info/contacts'); 

}

