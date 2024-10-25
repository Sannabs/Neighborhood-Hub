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
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize')
const app = express()

// IMPORTED ROUTES
const neighborhoodRoutes = require('./routes/Neighborhood')
const reviewRoutes = require('./routes/Review')
const userRoutes = require('./routes/User');
const renderRoutes = require('./routes/renderRoute')
const catchAsync = require('./utils/catchAsync');

// const dbUrl = 'mongodb://127.0.0.1:27017/Neigbor'
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/Neigbor'
const mongoStore = require('connect-mongo')

mongoose.connect(dbUrl)

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
app.use(mongoSanitize())


const secret = process.env.SECRET || 'thisshouldbeabettersecret!'
const store = mongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret,
    }
})

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

// cookie set up
const sessionConfig = {
    store,
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
app.use(helmet())


const scriptSrcUrls = [
    "https://cdn.jsdelivr.net/",
    "https://stackpath.bootstrapcdn.com/",
    "https://maps.googleapis.com/", // Google Maps API
    "https://maps.gstatic.com/",    // Google Maps imagery
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
];

const styleSrcUrls = [
    "https://cdn.jsdelivr.net/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",

];

const connectSrcUrls = [
    "https://maps.googleapis.com/", // Google Maps API
    "https://maps.gstatic.com/",    // Google Maps imagery
    
];

const fontSrcUrls = [
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com/",
    "https://use.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",

];

const imgSrcUrls = [
    "'self'",
    "blob:",
    "data:",
    "https://res.cloudinary.com/dg4dcyvol/", // Your Cloudinary account
    "https://media.istockphoto.com/",
    "https://images.pexels.com/",
    "https://cdn-clibi.nitrocdn.com",  // Additional image source
    "https://maps.gstatic.com/",       // Google Maps tiles and imagery
    "https://maps.googleapis.com/",    // Added Google Maps imagery source
    "http://maps.google.com/"
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: ["'none'"],
            imgSrc: ["'self'", "blob:", "data:", ...imgSrcUrls], // Google Maps imagery is already included
            fontSrc: ["'self'", "data:", ...fontSrcUrls],
        },
    })
);



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


// MY ROUTES PREFIX
app.use('/neighborhoods', neighborhoodRoutes)
app.use('/neighborhoods/:id/reviews', reviewRoutes)
app.use('/', userRoutes)
app.use('/', renderRoutes)

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