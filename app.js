if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

// export during refactoring
const ExpressError = require('./utils/ExpressError');
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User')
const Review = require('./models/Review')
const Neighborhood = require('./models/Neighborhood')

const { storeReturnTo } = require('./middleware');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const path = require('path');
// will allow you to be on your current page after loging in: instead of redirecting all the way to the home page
const localStrategy = require('passport-local')
//  for authentication with support for various strategies
const passport = require('passport');
// Server-side storage that keeps data for a user session.
const session = require('express-session');
// for temporary error messages and  success messages
const flash = require('connect-flash');
const app = express()

// IMPORTED ROUTES
const neighborhoodRoutes = require('./routes/Neighborhood')
const reviewRoutes = require('./routes/Review')
const userRoutes = require('./routes/User');
const catchAsync = require('./utils/catchAsync');


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



// cookie set up
const sessionConfig = {
    name: 'session',
    secret: "thisisasecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        // THAT WAY A USER WONT BE LOGGED IN FOREVER. WE DONT WANT THAT
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())

// AUTHENTICATION WITH PASSPORT
app.use(passport.initialize())
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());

// flash message middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.googleapikey = process.env.GOOGLE_MAPS_API_KEY;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use(storeReturnTo)  //REMOVE ME

// HOME PAGE
app.get('/', (req, res) => {
    res.send("HOME PAGE!")
})

app.get('/search', catchAsync(async (req, res) => {
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
}));

// MY ROUTES PREFIX
app.use('/neighborhoods', neighborhoodRoutes)
app.use('/neighborhoods/:id/reviews', reviewRoutes)
app.use('/', userRoutes)


// For my middlewares
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000")
})