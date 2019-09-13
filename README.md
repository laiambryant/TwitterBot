# TwitterBot
A simple Twitter bot that uses Twitter API, node, mogoDB and Websocket

Welcome to the TwitterBot. The objective of this twitter bot is to have some fun with the Twitter API showing how easy it can be to post massive amounts of tweets in a short period of time (as many as one per user every 12 seconds).It also implements a Chatroom for users to interact with each other.

The road map in explaining this twitter bot will be structured in the following way:

* General Information
* API
* Routes
* Services
* Views
* Things that can be improved on (if time permits)

I hope you'll enjoy using the bot, it's not perfect but it gets the job done and gives a good understanding of how node, web socket, twitter API and RESTful services work. I worked on this project on my own so i had to use some extra middleware to help me develop it in decent time, but i'll explain how you can expand on it in the specific paragraphs

# API

The api gives many methods to interact with the Database, retrieve and modify data, for examples go to [my postman API documentation](https://web.postman.co/collections/8114948-b581c4f0-2005-4e6d-ae55-f56821b15a87?workspace=e2341641-1082-4b8b-8450-b78968036cbb)

## Overview:
The API gives the users 7 GET methods (4 for Bots, 3 for Tweets), 1 POST, 1 PUT and 1 DELETE method (POST,PUT,DELETE only for Bots):

For PUT and POST Requests (Only available for bots) this is the model for the json:

~~~javascript
{
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
}
~~~


## Methods

The following are the methods offered by the API.

### **GET** "api/bots" 

**What Does it do?** Return all bots

Possible error codes:
>           200:OK
>           204:NO CONTENT, when there are no bots available in the DB
>           408:REQUEST TIMEOUT, the timeout is 7 seconds
>           500:INTERNAL SERVER ERROR

### **GET**    "api/bots/names"

**What Does it do?** Return all bot names

Possible error codes:
>          200:OK
>          204:NO CONTENT, when there are no bots available in the DB
>          408:REQUEST TIMEOUT, the timeout is 7 seconds
>          500:INTERNAL SERVER ERROR

### **GET** "api/bots/ids"

**What Does it do?** Return all bot ids

Possible error codes:
>          200:OK
>          204:NO CONTENT, when there are no bots available in the DB
>          408:REQUEST TIMEOUT, the timeout is 7 seconds
>          500:INTERNAL SERVER ERROR

### **GET** "api/bots/search/:id"        

**What Does it do?** return bot corresponding to the id

Possible error codes:
>          200:OK
>          404:NOT FOUND, The id does not correspond to any of the bots stored in the database
>          408:REQUEST TIMEOUT, the timeout is 7 seconds
>          500:INTERNAL SERVER ERROR

### **GET** "api/tweets"        

**What Does it do?** Return all tweets

Possible error codes:
>          200:OK
>          204:NO CONTENT, when there are no tweets available in the DB
>          408:REQUEST TIMEOUT, the timeout is 7 seconds
>          500:INTERNAL SERVER ERROR

### **GET** "api/tweets/search/:tweet_id"        

**What Does it do?** Returns tweet corresponding to the id

Possible error codes:
>          200:OK
>          404:NOT FOUND, The id does not correspond to any of the bots stored in the database
>          408:REQUEST TIMEOUT, the timeout is 7 seconds
>          500:INTERNAL SERVER ERROR

### **GET** "api/tweets/searchUID/:user_id"
**What Does it do?** Returns all tweets from the user corresponding to the id
Possible error codes:
>          200:OK
>          404:NOT FOUND, The id does not correspond to any of the bots stored in the database
>          408:REQUEST TIMEOUT, the timeout is 7 seconds
>          500:INTERNAL SERVER ERROR

### **POST** "api/bots"
**What Does it do?**Creates a new Bot Instance in the DB. The body must contain json.
Possible error codes:
>          200:OK
>          408:REQUEST TIMEOUT, the timeout is 7 seconds
>          500:INTERNAL SERVER ERROR

### **PUT** "api/bots/:id"
**What Does it do?** Modifies the bot corresponding to the id 
Possible error codes: Modifies the 
>          200:OK
>          404:NOT FOUND, The id does not correspond to any of the bots stored in the database
>          408:REQUEST TIMEOUT, the timeout is 7 seconds
>          500:INTERNAL SERVER ERROR

### **DELETE** "api/bots/:id"
**What Does it do?** Deletes the bot corresponding to the id
Possible error codes:
>          200:OK
>          404:NOT FOUND, The id does not correspond to any of the bots stored in the database
>          408:REQUEST TIMEOUT, the timeout is 7 seconds
>          500:INTERNAL SERVER ERROR

### Authentication
At the time there is no autentication required, but in the future authentication should be certainly added

### Rate limit
The only limit is how many requests the server can handle... not a very smart idea but time is limited.

#Routes

The routes are very simple and are divided in three separate files, all using express.Router():

* auth_routes.js 
* profile_routes.js
* routes.js

### Auth Routes

Auth Route handles the routes for Passport, the authentication middleware with two routes:

~~~javascript
router.get("/twitter", passport.authenticate("twitter", {
  scope:["profile"]
}));
~~~

This first route uses passport to authenticate the user, using the twitter strategy (more about that in the services page) and defines the scope of the request, in our case it will be the profile.

~~~javascript

router.get('/twitter/callback', passport.authenticate('twitter', {failureRedirect: '/login'}),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/profile/welcome');
  },

);

~~~
 
The second route handles the callback and redirects to /profile/welcome. ATTENTION: Should you want to replicate such function in your project you must give this second function the route you set up in your twitter develepoer account when requesting your user and access tokens.

### Profile Routes

The profile routes are simple, all they do is render the page that is requested if user is logged in, if user isn't logged in they redirect to the authentication page. Also the user object is sent with the request, to keep the user logged in.

The only exceptions are the "/msg" and "/tof" routes. The first i'll get into in the views page of the wiki, whilst the the second will be discussed now:

### The Red Thread of Fate

First of all an interesting thing: The name of this page is thread of fate, [here](https://en.wikipedia.org/wiki/Red_thread_of_fate) is a link to read more about it. It is linked to the purpose of the page.

~~~javascript
//Thread of fate
router.get("/tof",function(req,res){
    //If the user is not authenticated redirect to loginFailed
    if(!req.user){
        res.redirect("/profile/loginFailed");
    }else{
        res.render("thread_of_fate", {user:req.user} );
        
        try {
            //limit is 300 tweets/hour we could do 5 times more tweets if we wanted
            setInterval(() => {
                Tweet(Utilities.message_generator.apply());
            }, 1000*60/5);
        } catch (error) {
            Console.log(error);
        }
    }
});

var Tweet = function(Txt){
    var options = {
        status:Txt
    }
    twit.post ("statuses/update", options, function(err,data,res){
        if (err) console.log(err);
        else {            
            new Tw({
                created_at: data.created_at,
                id: data.id,
                id_str: data.id_str,
                text: data.text,
                entities: { 
                    hashtags: data.entities.hashtags,
                    symbols: data.entities.symbols,
                    user_mentions: data.entities.user_mentions,
                    urls: data.entities.urls 
                },
                
                source: data.source,
            
                user:{ 
                    id: data.user.id,
                    id_str: data.user.id_str,
                    name: data.user.name,
                    screen_name: data.user.screen_name,
                    location: data.user.location,
                    description: data.user.description,
                    created_at: data.user.created_at,
                    geo_enabled: data.user.geo_enabled,
                    verified: data.user.verified,
                    statuses_count: data.user.statuses_count,
                    profile_image_url:data.user.profile_image_url,
                    profile_image_url_https:data.user.profile_image_url_https,
                },
                
                retweet_count: data.retweet_count,
                favorite_count: data.favorite_count,
                favorited: data.favorited,
                retweeted: data.retweeted,
                lang: data.lang 
            }).save().then(()=>{
                console.log("tweet Saved");
            })

        }
    });
    
}
~~~

The "/tof" route is the route that starts the tweeting for the user and uses the [twit package](https://www.npmjs.com/package/twit) to tweet on the user's behalf with the Tweet() function that makes post requests to the twitter api, saving us time with nonces and the key encryptions. Once the function has posted the tweet, the tweet is then saved to the mongoDB server. Twitter authorizes 300 tweets/retweets per user every hour so we'll be scheduling tweets once every 12 seconds. We can't tweet the same message twice in a row so we use a function that picks a random tweet out of an array of possible tweets.

### Routes

The routes file handles basic routes (The main page for example). It also uses express.Router()

#Services

The Services folder is where all the authentication is done and where has its utility functions and its keys. it contains 4 files

* Keys.js
* Utility_functions.js
* passport_setup.js
* twit.js

## Keys.js

The keys.js file contains two objects, one for express-sessions and one for twitter authentication:

~~~javascript
module.exports = {

    twitter : {

        TWITTER_CONSUMER_KEY : "Insert Your data",
        TWITTER_CONSUMER_SECRET : "Insert Your data",
        ACCESS_TOKEN : "Insert Your data",
        ACCESS_TOKEN_SECRET : "Insert Your data"

    },

    SECRET : "Insert Sessions Secret you prefer"

};
~~~

The twitter parameters can be obtained for your app on the [Twitter Developer Page](https://developer.twitter.com/), all you have to do to apply is login with your twitter account and register your app. The Secret on the other hand is used to encrypt your cookies created with express sessions.

## Utility_functions.js
There are two utility functions within this file, the first is a random id generator for our mongodb, so that the app can have an id to (in future updates of the project) recognize maybe users that use the same IP address for example. 

~~~javascript
const  guid_generator =  function(){
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
~~~

The second function has an array of strings from witch it picks a random value and selects one, so that the app can schedule tweets.

## Passport_setup.js

The Passport_setup file uses passport and passport-twitter to authenticate the user to the app. All passport really does is generate the post request on the app's behalf. Normally for a twitter request you need 7 parameters 

Here's an example request:

> curl -XPOST 
>  --url 'https://api.twitter.com/1.1/statuses/update.json?status=hello' 
>  --header 'authorization: OAuth
>  oauth_consumer_key="oauth_customer_key",
>  oauth_nonce="generated_oauth_nonce",
>  oauth_signature="generated_oauth_signature",
>  oauth_signature_method="HMAC-SHA1",
>  oauth_timestamp="generated_timestamp",
>  oauth_token="oauth_token",
>  oauth_version="1.0"'

All passport does is handle the request whilst generating the nonce, the signature and the timestamp and to do so it uses the passport-twitter strategy (Trust Proxy must be set to false for oAuth 1.0A).

The callback of the passport authentication will give the app access to acess_token and refresh_token that will be stored in a user object structured in such way:

~~~javascript
var user = {
  access_token: null,
  refresh_token: null,
  profile:null,
  authorized:null
};
~~~

This object will be exported, and so will passport.

After access token and refresh token are saved in the app, the app checks if the user is already in the DB and if he's not the data of the profile is saved to the DB.

There are two more functions that are used by passport to serialize and deserialize users to and from the database.

### Twit.js

Twit.js is the file in which the app configs the Twit middleware, giving it the keys of the app and a timeout for HTTP requests.

~~~javascript
var T = new Twit({
  consumer_key:         Keys.twitter.TWITTER_CONSUMER_KEY,
  consumer_secret:      Keys.twitter.TWITTER_CONSUMER_SECRET,
  access_token:         Keys.twitter.ACCESS_TOKEN,
  access_token_secret:  Keys.twitter.ACCESS_TOKEN_SECRET,
  timeout_ms:           60*1000, //Timeout for HTTP requests
})
~~~

Twit gives us methods to post easily to the twitter API.

#Views

The views section is very straight forward. The app uses [ejs](https://ejs.co/) as a view engine.
The code is all basic html, css and js. Ejs can be very useful for example if you have to render dynamic data like, for example, the name of the user that has authenticated to your app.

The main reason why there even is the views page is to talk about the message page.

The message page implements with jquery and socket.io a websocket chat:

~~~javascript
        var socket = io();
        $("document").ready(function(){
          
          const ADDR = "http://127.0.0.1:3000";
  
          const front_end_socket = io.connect(ADDR);
  
          //Query to the DOM
          var output = document.getElementById("output");
  
          $("button").click(function () {
              
            var message = document.getElementById("message");
            var username = document.getElementById("username");
              front_end_socket.emit("chatmsg",{
                message:message.value,
                username:username.value
              });
          });
  
          //Listener for events on the client
          front_end_socket.on("chat", function(data){
              output.innerHTML += "<p><strong>" + data.username + ":</strong>" + data.message + "</p>"
          });
  
          });
~~~

This code first of all starts the websocket and then checks if the document is ready and then queries the DOM for the output element. We then have a username that can be edited but for default it will be the twitter name of the user, and a message box in which users can write messages. There is an event listener for the click and the message data is then sent onto the websocket and recieved by the server. The server then emits the message to all users that have a function that prints the User that sent the message followed  by the message itself.

# Things that can be improved on

I'll give a brief list of things about the project that could certainly be improved.

1. More API Methods 
2. More Functionalities
3. Better Error Handling
4. Improved Modularity (especially the websocket on the ejs page and in the app.js file and the Tweet() function in the profile_routes.js file)
5. Removing middleware. Whilst middleware is surely faster than the code written by one single developer(it is the product of the combined effort of many talented developers), you only get a grasp of how things work "under the hood". Web development can be extremely frustrating at times, and requires deep understanding of what you're working on or you'll always be scraping the surface of web development.
