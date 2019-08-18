const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const app = express();
const apiRoutes = require("./API/api");
const authRoutes = require("./API/auth_routes");
const ejsRoutes = require("./API/ejs_routes");
const expressSession = require("express-session");
const Keys = require("./Services/Keys");
const passport = require("passport");

//the connection string has the following format
const CONNECTIONSTRING = 'mongodb://localhost/botnet';
//port connected to on the Localhost
const PORT =4040;
//default console message
const consoleMsg = function(){console.log("Server Listening for requests at the port: " + PORT);};
//Sessions Key
const SESSIONS_KEY = Keys.SECRET;

//connect do MongoDb
//{useNewUrlParser:true} is inserted because the old
//url parser of mongoose is deprecated. In the future
//this urlParser will become the standard, so this
//specification won't be necessary
mongoose.connect(CONNECTIONSTRING, {useNewUrlParser:true});
//Mongoose version of the promise is deprecated
//overrided to the global Promise
mongoose.Promise = global.Promise;

//ejs view engine
app.set("view engine", "ejs");
//static files
app.use(express.static("views"));

//sessions
app.use(expressSession({ 
  secret: SESSIONS_KEY,
  cookie: { maxAge: 60000 },
  resave:false,
  saveUninitialized:false
}))

//give access to the cookie parser
app.use(cookieParser());
//give access to the JSON body parser
app.use(bodyParser.json());

//Passport Utilities
app.use(passport.initialize());
app.use(passport.session());

//IMPORTANT: bodyParser has to have priority over routes
//otherwise you won't recieve requests and you won't be able
//to parse them
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);
app.use("/", ejsRoutes);

//422 Unprocessable Entity error handler
app.use(function(err,req,res,next){
  res.status(422).send({error:err.message});
});


//listen for requests
app.listen(process.env.PORT || PORT, consoleMsg);
