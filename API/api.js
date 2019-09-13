const express = require("express");
const router = express.Router();
const Bot = require("../Models/bot");
const Tweet = require("../Models/tweet");

const TIMEOUT = 20*1000;

//*******************************************************//
//                  BOTS API REQUESTS                    //
//*******************************************************//

//Get request, returns all bots
router.get('/bots', function(req,res,next){

  //Queries the DB (SELECT * FROM Bots)
  Bot.find({}).exec().then(function(bots){

    //Checks if there are bots in the DB
    if(!bots) res.status(204).json({error:"There are no bots in the DB"});
    else res.status(200).send(bots);

  }).catch(function(err){
    res.status(500).json({error:err});
  });

  //If the request can't be served in 20
  //seconds returns res.end() to terminate request
  setTimeout(function(){res.status(408).end();}, TIMEOUT);

});

//Get request for twitter names of users subscribed to the service
router.get('/bots/names', function(req,res,next){
  //Queries the DB(SELECT tw_name FROM Bots)
  Bot.find({}).select("tw_screen_name").exec().then(function(bots){  
    //Checks if the query returned any bots    
    if(!bots)res.status(204).json({error:"There are no bots in the DB"}); 
    else res.status(200).json(bots);

    }).catch(function(err){
      res.status(500).json({error:err});
  });

  //If the request can't be served in 20
  //seconds returns res.end() to terminate request
  setTimeout(function(){res.status(408).end();}, TIMEOUT);

});

//Get request for twitter ids of users subscribed to the service
router.get('/bots/ids', function(req,res,next){

  //Queries the DB(SELECT tw_id_str FROM Bots)
  Bot.find({}).select("tw_id").exec().then(function(bots){

    //Checks if the query returned any bots
    if(!bots) res.status(204).json({error:"There are no bots in the DB"});
    else res.status(200).json(bots);

  }).catch(function(err){
    res.status(500).json({error:err});
  });

  //If the request can't be served in 20
  //seconds returns res.end() to terminate request
  setTimeout(function(){
    console.log("408:Request Timeout");
    res.status(408).end();
  }, TIMEOUT);

});

//Get request for bots corresponding to a certain id
router.get('/bots/search/:id', function(req,res,next){

  //Queries the DB (SELECT * FROM Bots where req.params.id = id)
  Bot.find({tw_id:req.params.id}).exec().then(function(bots){

    //Checks if the query returned any bots
    if(!bots) res.status(404).json({error:"404: User not found, try again"});
    else res.status(200).json(bots);

  }).catch(function(err){
    res.status(500).json({error:err});
  })

  //If the request can't be served in 20
  //seconds returns res.end() to terminate request
  setTimeout(function(){res.status(408).end();}, TIMEOUT);

});


//POSTs new instance of Bot in the MongoDB database
//structure of the JSON is the following
///////////////////////////////////////////////
//          {                                //
//            my_id:String,                  //
//            username:String,               //
//            tw_id:Number,                  //
//            tw_screen_name:String,         //
//            followers:Number,              //
//            friends:Number,                //
//            active:Boolean                 //
//           }                               //
///////////////////////////////////////////////

router.post("/bots",function(req,res,next){

  //Checks if the user is already in the DB
  //(SELECT tw_id FROM Bots )
  if(req.body.tw_id == Bot.find({}).select("tw_id")) res.status(400).end();

  //Creates new Bot instance in the DB 
    const bot = new Bot({
      
      my_id:req.body.my_id,
      username:req.body.username,
      tw_id:req.body.tw_id,
      tw_screen_name :req.body.tw_screen_name,
      followers:req.body.followers,
      friends:req.body.friends,
      active:false
      
    });

    //Saves bot
    bot.save().then(function(bot){
      res.status(200).json(bot)
    }).catch(function(err){
      res.status(500).json({error:err});
    });

    //If the request can't be served in 20
    //seconds returns res.end() to terminate request
    setTimeout(function(){res.status(408).end();}, TIMEOUT);

});

//PUTs new instance of Bot in the MongoDB database
//structure of the JSON is the following
///////////////////////////////////////////////
//          {                                //
//            my_id:String,                  //
//            username:String,               //
//            tw_id:Number,                  //
//            tw_screen_name:String,         //
//            followers:Number,              //
//            friends:Number,                //
//            active:Boolean                 //
//           }                               //
///////////////////////////////////////////////

router.put("/bots/:id",function(req,res,next){

    //The id specified in the url will be found and the
    //corresponding bot account data will be updated
    //(SELECT * FROM Bots WHERE req.params.id=id)
    Bot.findById(req.params.id).updateOne(req.body).exec().then(function(bots){

      //Checks if the query returned any bots
      if(!bots)res.status(404).json({error:"404: User not found, try again"}) 
      else res.status(200).json(bots);

    }).catch(function(err){
      res.status(500).json({error:err});
    });

    //If the request can't be served in 20
    //seconds returns res.end() to terminate request
    setTimeout(function(){res.status(408).end();}, TIMEOUT);

});


//deletes bot data from db
router.delete("/bots/:id",function(req,res,next){
    
    //the Id specified in the url will be found and the
    //corresponding bot account data will be removed
    //(SELECT * FROM Bots WHERE req.params.id=id)
    Bot.findById(req.params.id).deleteOne().exec().then(function(bots){
      
      //Checks if the query returned any bots
      if(!bots) res.status(404).json({error:"404: User not found, try again"})
      else res.status(200).json(bots);
      
    }).catch(function(err){
      res.status(500).json({error:err});
    })

    //If the request can't be served in 20
    //seconds returns res.end() to terminate request
    setTimeout(function(){res.status(408).end();}, TIMEOUT);

});


//*******************************************************//
//                 TWEETS API REQUESTS                   //
//*******************************************************//

//Returns ids and text of all tweets
router.get("/tweets",function (req,res,next) {
  //Queries the DB (SELECT id,text FROM bots)
  Tweet.find({}).then(function(tweet){
    
    //Checks if there are any Tweets saved
    if(!tweet) res.status(408).json({ error:"408: No tweets were found"});
    else res.status(200).json(tweet)

  }).catch(function(err){
    res.status(500).json({error:err});
  }); 

  //If the request can't be served in 20
  //seconds returns res.end() to terminate request
  setTimeout(function(){res.status(408).end();}, TIMEOUT);

});

//returns data for the tweet corresponding to 
//the :id field in the request URL
router.get("/tweets/search/:id",function (req,res,next) {
  //The object that will be passed to the query

  //Queries the DB (SELECT * FROM Bots WHERE id = req.params.id)
  Tweet.find({id_str:req.params.id}).then(function(tweet){

    //Checks if the query returned any bots
    if(!tweet) res.status(404).json({error:"404: tweet not found"})
    else res.status(200).json(tweet)

  }).catch(function(err){
    res.status(500).json({error:err});
  });

  //If the request can't be served in 20
  //seconds returns res.end() to terminate request
  setTimeout(function(){res.status(408).end();}, TIMEOUT);

});

//Returns all tweets from the user corresponding
//to the :user_id field in the request url
router.get("/tweets/searchUID/:id", function(req,res,next){

  //Queries the DB (SELECT id FROM (SELECT user FROM Bots) where id = user_id)
  Tweet.find({"user.id":req.params.id}).then(function(tweet){
    //{user:{id_str:req.params.id}}
    //Checks if the query returned any bots
    if(!tweet) res.status(404).json({error:"404: user not found"});
    else res.status(200).json(tweet);

  }).catch(function(err){
    res.status(500).json({error:err});
  });

  //If the request can't be served in 20
  //seconds returns res.end() to terminate request
  setTimeout(function(){res.status(408).end();}, TIMEOUT);

})

//exports routes
module.exports = router;
