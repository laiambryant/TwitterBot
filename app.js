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
const CONNECTIONSTRING = 'mongodb://localhost/botnet';
//port connected to on the Localhost
const PORT = 3000;
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

//static files
app.use(express.static("public"));
//ejs view engine
app.set("view engine", "ejs");

//sessions
app.use(expressSession({ 
  secret: SESSIONS_KEY,
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

//listen for requests
var server = app.listen(process.env.PORT || PORT, consoleMsg);

//WebSocket
const io = socket(server);

io.on("connection", function(socket){
  socket.on("chatmsg", function(data){
    io.emit("chat",data);
  });
});

