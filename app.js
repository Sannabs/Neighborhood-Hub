// export during refactoring
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const { validateNeighborhood, validateReview, storeReturnTo} = require('./middleware');

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const path = require('path');
const Neighborhood = require('./models/Neighborhood');
const Review = require('./models/Review');
const User = require('./models/User');
// will allow you to be on your current page after loging in: instead of redirecting all the way to the home page
const localStrategy = require('passport-local')
//  for authentication with support for various strategies
const passport = require('passport');
// Server-side storage that keeps data for a user session.
const session = require('express-session');
// for temporary error messages and  success messages
const flash = require('connect-flash');

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
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.get('/', (req, res) => {
    res.send("HOME PAGE!")
})


// NEIGHBORHOOD CRUD

// HANDLES THE INDEX PAGE AKA LANDING PAGE FOR ME:

app.get('/neighborhoods', catchAsync(async (req, res) => {
    const neighborhoods = await Neighborhood.find({})
    res.render('hoods/index', { neighborhoods })
}))

// ADD NEW
app.get('/neighborhoods/new', (req, res) => {
    res.render('hoods/new')
})

app.post('/neighborhoods', validateNeighborhood, catchAsync(async (req, res) => {
    const neighborhood = new Neighborhood(req.body.neighborhood)
    await neighborhood.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/neighborhoods/${neighborhood._id}`)
}))

// SHOW PAGE
app.get('/neighborhoods/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const neighborhood = await Neighborhood.findById(id).populate({ path: 'reviews' })
    res.render('hoods/show', { neighborhood })
}))

// UPDATING
app.get('/neighborhoods/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params
    const neighborhood = await Neighborhood.findById(id)
    res.render('hoods/edit', { neighborhood })
}))

app.put('/neighborhoods/:id', validateNeighborhood, catchAsync(async (req, res) => {
    const { id } = req.params
    const neighborhood = await Neighborhood.findByIdAndUpdate(id, { ...req.body.neighborhood }, { new: true })
    res.redirect(`/neighborhoods/${neighborhood._id}`)
}))

// DELETING SOMETHING
app.delete('/neighborhoods/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const neighborhood = await Neighborhood.findByIdAndDelete(id)
    res.redirect(`/neighborhoods`)
}))



//REVIEW CRUD
// creating review
app.post('/neighborhoods/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const neighborhood = await Neighborhood.findById(id)
    const review = new Review(req.body.review)
    neighborhood.reviews.push(review)
    await review.save()
    neighborhood.save();
    res.redirect(`/neighborhoods/${neighborhood._id}`)
}))
app.put('/neighborhoods/:id/reviews/:reviewId', validateReview, catchAsync(async (req, res) => {
    console.log(req.body)
    const { id, reviewId } = req.params;
    const { rating, body } = req.body.review;  // Use req.body.review to match the form structure

    // Update the review
    const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        { rating, body },
        { new: true }
    );

    res.redirect(`/neighborhoods/${id}`);
}));


app.delete('/neighborhoods/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Neighborhood.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/neighborhoods/${id}`)
}))


// REGISTER OR SIGN UP 
app.get('/register', (req, res) => {
    res.render('users/register')
})

app.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = await new User({email, username})
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Neighborhood hub')
            res.redirect('/neighborhoods')
        });
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')

    }
}))


// LOGIN THINGY
app.get('/login', (req, res) => {
    res.render('users/login')
})


app.post('/login', storeReturnTo, passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
}), (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = res.locals.returnTo || '/neighborhoods';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

// LOGOUT
app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if(err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!')
        res.redirect('/neighborhoods')
    })
})



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