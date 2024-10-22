const express = require('express');
const render = require('../controllers/Render')
const catchAsync = require('../utils/catchAsync')
const router = express.Router();

router.get('/', render.home)
router.get('/about', render.about)
router.get('/privacy', render.privacy)
router.get('/contact', render.contact)
router.get('/search', catchAsync(render.search))
module.exports = router;