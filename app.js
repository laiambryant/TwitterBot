const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const router = require("./API/api");
//the connection string has the following format
const CONNECTIONSTRING = 'mongodb://localhost/botnet';

//default console message
const consoleMsg = function(){console.log("Server Listening for requests");};

//connect do MongoDb
//{useNewUrlParser:true} is inserted because the old
//url parser of mongoose is deprecated. In the future
//this urlParser will become the standard, so this
//specification won't be necessary
mongoose.connect(CONNECTIONSTRING, {useNewUrlParser:true});
//Mongoose version of the promise is deprecated
//overrided to the global Promise
mongoose.Promise = global.Promise;

app.use(express.static('Public'));
//IMPORTANT: bodyParser has to have priority over Router
//otherwise you won't be able to read the json for the requests you get
app.use(bodyParser.json());

app.use("/api",router);

//422 Unprocessable Entity error handler
app.use(function(err,req,res,next){
  res.status(422).send({error:err.message});
});


//listen for requests
app.listen(process.env.PORT || 4040, consoleMsg);
