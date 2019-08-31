const mongoose = require("mongoose");
const schema = mongoose.Schema;


//create schema for our bots
const botSchema = new schema({

    my_id:{
        type:String,
    },

    username:{
        type:String
    },
    
    tw_id:{
        type:Number
    },

    tw_id_str:{
        type:String
    },

    tw_name:{
        type:String
    },

    tw_screen_name : {
        type:String
    },

    followers:{
        type:Number
    },

    friends:{
        type:Number
    }

});


const Bot = mongoose.model("bot", botSchema);

module.exports = Bot;
