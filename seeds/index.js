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
    await Neighborhood.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const rand10 = Math.floor(Math.random() * 10);
        const price = Math.floor(Math.random() * 10) + 20;
        
        const hood = new Neighborhood({
            title: `${sample(descriptors)}, ${sample(places)}`,
            name: `Neighborhood ${i + 1}`,  // Example name, you can adjust this
            author: '66dd03b1a39c99761ffb1960',
            location: hoods[rand10].location,
            price,
            images: [
                {
                    url:'https://res.cloudinary.com/dg4dcyvol/image/upload/v1725985583/Neigbor/bjchnlqmj5rzmtrgxy2t.jpg',
                    filename:'Neigbor/bjchnlqmj5rzmtrgxy2t',
  
                },
                {
                  url: 'https://res.cloudinary.com/dg4dcyvol/image/upload/v1725985587/Neigbor/atzhetxqauzadth1ejsh.jpg',
                  filename:'Neigbor/atzhetxqauzadth1ejsh'
                }
              ],
            description: "Nestled between lush greenery and vibrant local markets, this neighborhood offers a perfect blend of urban convenience and suburban tranquility. Its tree-lined streets are home to charming cafes and a tight-knit community spirit.",
            schools: hoods[rand10].schools || [],  // Default to an empty array if no schools provided
            transport: hoods[rand10].transport || [],  // Default to an empty array if no transport provided
            safety: hoods[rand10].safety,
            population: hoods[rand10].population || 0,  // Default to 0 if no population provided
            businesses: hoods[rand10].businesses || [],  // Default to an empty array if no businesses provided
            cordinates: hoods[rand10].cordinates || [0, 0]  // Default coordinates if none provided
        });

        await hood.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
