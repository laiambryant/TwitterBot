const mongoose = require("mongoose");
const schema = mongoose.Schema;


//create schema for our bots
const tweetSchema = new schema({

    created_at: String,
    id: Number,
    id_str: String,
    text: String,
    entities: { hashtags: Array, symbols: Array, user_mentions: Array, urls: Array },
    source: String,

    user:{ 
        id: Number,
        id_str: String,
        name: String,
        screen_name: String,
        location: String,
        description: String,
        created_at: String,
        geo_enabled: Boolean,
        verified: Boolean,
        statuses_count: Number,
        profile_image_url:String,
        profile_image_url_https:String,
    },
    
    retweet_count: Number,
    favorite_count: Number,
    favorited: Boolean,
    retweeted: Boolean,
    lang: String 

});


const Tweet = mongoose.model("tweet", tweetSchema);

module.exports = Tweet;