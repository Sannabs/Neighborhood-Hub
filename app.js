const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const path = require('path');
const app = express()

mongoose.connect('mongodb://127.0.0.1:27017/Neigbor')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.send("HOME PAGE!")
})

app.get('/hoods', (req, res) => {
    res.render('hoods/index')
})



app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000")
})