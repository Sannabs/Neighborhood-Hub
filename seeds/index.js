const Neighborhood = require('../models/Neighborhood');
const mongoose = require('mongoose');




mongoose.connect('mongodb://127.0.0.1:27017/Neigbor')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});
