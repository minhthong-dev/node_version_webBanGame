const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/User');
require('dotenv').config();


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await userModel.findOne({ email: profile.emails[0].value });
            if (user) {
                return done(null, user);
            }
            const newUser = new userModel({
                email: profile.emails[0].value,
                name: profile.displayName,
                avatar: profile.photos[0].value,
            });
            await newUser.save();
            return done(null, newUser);
        } catch (error) {
            console.log(error)
        }
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


module.exports = passport;