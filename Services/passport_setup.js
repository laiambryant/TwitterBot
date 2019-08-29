const passport = require("passport");
const Strategy = require("passport-twitter").Strategy;
const Keys = require("./Keys");
const CB_URL =  "http://127.0.0.1:3000/auth/twitter/callback";
const Bot = require("../Models/bot");
const trustProxy = false;
const Utilities = require("./Utility_Functions");


passport.use(new Strategy({
    callbackURL: CB_URL,
    consumerKey: Keys.twitter.TWITTER_CONSUMER_KEY,
    consumerSecret: Keys.twitter.TWITTER_CONSUMER_SECRET,
    access_token_key: Keys.twitter.ACCESS_TOKEN,
    access_token_secret: Keys.twitter.ACCESS_TOKEN_SECRET,
    proxy:trustProxy
  },function (access_token, refresh_token, profile, cb) {
    //checks if user already exists in db
    Bot.findOne({tw_id:profile._json.id}).then((currentUser)=>{
      if(currentUser){
        //User already exists
        console.log("User is: " + currentUser);
      } else {

        //User doesn't exist, create new instance in DB
        new Bot({
      
          my_id: Utilities.guid_generator,
          username: profile._json.username,
          tw_id: profile._json.id,
          tw_id_str: profile._json.id_str,
          tw_name: profile._json.name,
          tw_screen_name: profile._json.screen_name,
          followers: profile._json.followers_count,
          friends: profile._json.friends_count
    
        }).save().then((newBot)=>{
    
          console.log("new Bot created" + newBot);
    
        });    
      }
    })
   
  }
));


passport.serializeUser(function(user, callback) {
  console.log('serializeUser: ' + user._id)
  return callback(null, user._id);
})

passport.deserializeUser(function(obj, callback) {
  return callback(null, obj);
})


module.exports = passport;
