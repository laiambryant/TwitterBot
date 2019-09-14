const passport = require("passport");
const Strategy = require("passport-twitter").Strategy;
const Keys = require("./Keys");
const Bot = require("../Models/bot");
const trustProxy = false;
const Utilities = require("./Utility_Functions");

var user = {
  access_token: null,
  refresh_token: null,
  profile:null,
  authorized:null
};

//Passport Setup
passport.use(new Strategy({

    //Data required for passport Strategy, stored in the Keys file
    callbackURL: Keys.twitter.CB_URL,
    consumerKey: Keys.twitter.TWITTER_CONSUMER_KEY ,
    consumerSecret: Keys.twitter.TWITTER_CONSUMER_SECRET,
    access_token_key: Keys.twitter.ACCESS_TOKEN,
    access_token_secret: Keys.twitter.ACCESS_TOKEN_SECRET,
    //necessary for Oauth 1.0
    proxy:trustProxy

  },function (access_token, refresh_token, profile, cb) {
    
    //stores access token, refresh token and profile in the user variable
    user.access_token = access_token;
    user.refresh_token = refresh_token;
    user.profile = profile;
    //used to logout
    user.authorized = true;

    //checks if user already exists in db
    Bot.findOne({tw_id:profile._json.id}).then((currentBot)=>{
      if(currentBot){
        //User already exists, callback
        cb(null, currentBot);
      } else {

        //User doesn't exist, create new instance in DB
        new Bot({

          //Creates a Random Id, algorithm is in the Utility_Functions file
          my_id: Utilities.guid_generator,

          //data from the twitter api to save to the db
          username: profile._json.username,
          tw_id: profile._json.id,
          tw_id_str: profile._json.id_str,
          tw_name: profile._json.name,
          tw_screen_name: profile._json.screen_name,
          followers: profile._json.followers_count,
          friends: profile._json.friends_count,

        }).save().then((newBot)=>{
          //New User created, callback
          cb(null,newBot);
        });    
      
      }

    })

  }

));

passport.serializeUser(function(user, cb) {
  //serializes User
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  //finds instance of bot in the MongoDB bot and deserializes it
  Bot.findById(obj).then((bot)=>{
    cb(null, bot);
  });
});

module.exports = {
  passport,user
};
