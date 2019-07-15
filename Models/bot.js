const mongoose = require("mongoose");
const schema = mongoose.Schema;

//create geolocation Schema
const GeoSchema = new schema({

  type:{
    //type of the type will be string
    type:"String",
    default:"Point"
  },
  coordinates:{
    type:[Number],
    //mongodb can use 2d or 2dSphere. We use 2dSphere because the
    //distance between our two points in 2d would be the ray, while
    //we wan the distance to be calculated as if they were
    //2 points on a sphere to be more accurate
    index:"2dsphere"
  }

});

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

    //geolocation, www.geoJson.org to see the format
    geometry:GeoSchema

});


const Bot = mongoose.model("bot", botSchema);

module.exports = Bot;
