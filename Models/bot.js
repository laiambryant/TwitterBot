const mongoose = require("mongoose");
const schema = mongoose.Schema;


//create schema for our bots
const botSchema = new schema({


    id:{
        type:String,
        required: [true, "Id is required"],
    },

    username:{
        type:String,
        required: [true, "Name is required"]
    },

});


const Bot = mongoose.model("bot", botSchema);

module.exports = Bot;
