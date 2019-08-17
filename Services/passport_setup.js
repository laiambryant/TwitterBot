const passport = require("passport");
const Strategy = require("passport-twitter").Strategy;
const Keys = require("./Keys");
const CB_URL =  "http://127.0.0.1:3000/auth/twitter/callback";


passport.use(new Strategy({
    callbackURL: CB_URL,
    consumerKey: Keys.twitter.TWITTER_CONSUMER_KEY,
    consumerSecret: Keys.twitter.TWITTER_CONSUMER_SECRET,
    access_token_key: Keys.twitter.ACCESS_TOKEN,
    access_token_secret: Keys.twitter.ACCESS_TOKEN_SECRET
  },  function(token, tokenSecret, profile, done) {

    }
));


passport.serializeUser(function(user, callback) {
  callback(null, user);
})

passport.deserializeUser(function(obj, callback) {
  callback(null, obj);
})


module.exports = passport;
