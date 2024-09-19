const mongoose = require('mongoose');
const Neighborhood = require('../models/Neighborhood');
const { descriptors, places } = require('./GambiaData');
const hoods = require('./hoods');

mongoose.connect('mongodb://127.0.0.1:27017/Neigbor');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    try {
        await Neighborhood.deleteMany({});

        for (let i = 0; i < 50; i++) {
            const randIndex = Math.floor(Math.random() * hoods.length);
            const price = Math.floor(Math.random() * 500) + 300;
            
            const hood = new Neighborhood({
                title: `${sample(descriptors)}, ${sample(places)}`,
                author: '66dd03b1a39c99761ffb1960',  // Ensure this is a valid user ID
                location: `${hoods[randIndex].name}, ${hoods[randIndex].country}`,
                price,
                geometry: { 
                    type: 'Point', 
                    coordinates: [
                        hoods[randIndex].longitude,
                        hoods[randIndex].latitude
                    ] 
                },
                images: [
                    {
                        url: 'https://res.cloudinary.com/dg4dcyvol/image/upload/v1725985583/Neigbor/bjchnlqmj5rzmtrgxy2t.jpg',
                        filename: 'Neigbor/bjchnlqmj5rzmtrgxy2t',
                    },
                    {
                        url: 'https://res.cloudinary.com/dg4dcyvol/image/upload/v1725985587/Neigbor/atzhetxqauzadth1ejsh.jpg',
                        filename: 'Neigbor/atzhetxqauzadth1ejsh',
                    }
                ],
                description: hoods[randIndex].description,
                schools: hoods[randIndex].schools || [],  // Default to an empty array if no schools provided
                transport: hoods[randIndex].transport || [],  // Default to an empty array if no transport provided
                safety: hoods[randIndex].safety,
                population: hoods[randIndex].population || 0,  // Default to 0 if no population provided
                businesses: hoods[randIndex].businesses || [],  // Default to an empty array if no businesses provided
            });

            await hood.save();
        }
        console.log("Database Seeded Successfully");
    } catch (err) {
        console.error("Error seeding database:", err);
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
