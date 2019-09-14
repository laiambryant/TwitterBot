var Twit = require('twit');
const Keys = require("./Keys")
const mess_gen = require("./Utility_Functions");

 
var T = new Twit({
  consumer_key:         Keys.twitter.TWITTER_CONSUMER_KEY,
  consumer_secret:      Keys.twitter.TWITTER_CONSUMER_SECRET,
  access_token:         Keys.twitter.ACCESS_TOKEN,
  access_token_secret:  Keys.twitter.ACCESS_TOKEN_SECRET,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})


module.exports = T;
 