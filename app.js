const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const routes = require("./Routes/routes");
const apiRoutes = require("./API/api");
const authRoutes = require("./Routes/auth_routes");
const profileRoutes = require("./Routes/profile_routes");
const expressSession = require("express-session");
const Keys = require("./Services/Keys");
const passport = require("passport");
const socket = require("socket.io");

const app = express();

//the connection string has the following format
const CONNECTIONSTRING = 'mongodb://mongo:27017/botnet';
//port connected to on the Localhost
const PORT = 3000;
//default console message
const consoleMsg = function(){console.log("Server Listening for requests at the port: " + PORT);};

//connect do MongoDb
//{useNewUrlParser:true} is inserted because the old
//url parser of mongoose is deprecated. In the future
//this urlParser will become the standard, so this
//specification won't be necessary
mongoose.connect(
  CONNECTIONSTRING, 
  {useNewUrlParser:true,
  reconnectInterval:1000,
  connectTimeoutMS:5000,
  }
).then(()=>{
  console.log("Connected to MongoDB")
}).catch((err)=>{
  console.log(err)
});
  
//Mongoose version of the promise is deprecated
//overrided to the global Promise
mongoose.Promise = global.Promise;

//static files
app.use(express.static("public"));
//ejs view engine
app.set("view engine", "ejs");

//sessions
app.use(expressSession({ 
  secret: Keys.SECRET,
  key : "sid",
  cookie: { 
    //1 day
    maxAge: 1000*60*60*24 ,
    //secure should become true when site is https enabled
    secure: false
  },
  resave: true,
  saveUninitialized:true
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
app.use("/", routes)
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

//422 Unprocessable Entity error handler
app.use(function(err,req,res,next){
  res.status(422).send({error:err.message});
});

//listen for requests
var server = app.listen(PORT, consoleMsg);

//WebSocket
const io = socket(server);

io.on("connection", function(socket){
  socket.on("chatmsg", function(data){
    io.emit("chat",data);
  });
});

