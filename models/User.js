const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// handles password hashing and salting and also provides some authentication for password and username
// handles user data like password and email
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    signupDate: {
        type: Date,
        default: Date.now 
    }
});

// Use passport-local-mongoose to handle password hashing and authentication
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
