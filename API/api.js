const express = require("express");
const router = express.Router();
const Bot = require("../Models/bot");
const Tweet = require("../Models/tweet");

//*******************************************************//
//                   BOTS API REQUESTS
//*******************************************************//

//Get request, returns all bots
router.get('/bots', function(req,res,next){
    Bot.find({}).exec().then(function(bots){
      if(!bots){
        res.status(204).json({error:"There are no bots in the DB"});
      }else{
        res.status(200).send(bots);
      }
    }).catch(function(err){
      res.status(500).json({error:err});
    });
    //If the request can't be served in 7
    //seconds returns res.end() to terminate request
    setTimeout(function(){
      console.log("408:Request Timeout");
      res.status(408).end();
    }, 7000);
});

//Get request for twitter names of users subscribed to the service
router.get('/bots/names', function(req,res,next){
  Bot.find({}).select("tw_name").exec().then(function(bots){
  if(!bot){
    res.status(204).json({error:"There are no bots in the DB"});
  } else res.status(200).json(bots);
  }).catch(function(err){
    res.status(500).json({error:err});
  })
  //If the request can't be served in 7
  //seconds returns res.end() to terminate request
  setTimeout(function(){
    console.log("408:Request Timeout");
    res.status(408).end();
  }, 7000);
});

//Get request for twitter ids of users subscribed to the service
router.get('/bots/ids', function(req,res,next){
  Bot.find({}).select("tw_id_str").exec().then(function(bots){
    if(!bot){
      res.status(204).json({error:"There are no bots in the DB"});
    } else res.status(200).json(bots);
  }).catch(function(err){
    res.status(500).json({error:err});
  })
  //If the request can't be served in 7
  //seconds returns res.end() to terminate request
  setTimeout(function(){
    console.log("408:Request Timeout");
    res.status(408).end();
  }, 7000);
});

//Get request for bots corresponding to a certain id
router.get('/bots/:id', function(req,res,next){
  Bot.findById(req.params.id).exec().then(function(bot){
    if(!bot){
      res.status(404).json({error:"404: User not found, try again"})
    } else {
      res.status(200).json(bot);
    }
  }).catch(function(err){
    res.status(500).json({error:err});
  })
  //If the request can't be served in 7
  //seconds returns res.end() to terminate request
  setTimeout(function(){
    console.log("408:Request Timeout");
    res.status(408).end();
  }, 7000);
});


//creates new instance of Bot in the MongoDB database
router.post("/bots",function(req,res,next){

    const bot = new Bot({
      
      my_id:req.body.my_id,
      username:req.body.username,
      tw_id:req.body.tw_id,
      tw_screen_name :req.body.tw_screen_name,
      followers:req.body.followers,
      friends:req.body.friends,
      active:false
      
    })

    bot.save().then(function(bot){
      
    }).catch(function(err){
      res.status(500).json({error:err});
    });
    //If the request can't be served in 7
    //seconds returns res.end() to terminate request
    setTimeout(function(){
      console.log("408:Request Timeout");
      res.status(408).end();
    }, 7000);
});

//updates bot data in the db
router.put("/bots/:id",function(req,res,next){
    //the id specified in the url will be found and the
    //corresponding bot account data will be updated
    Bot.findById(req.params.id).updateOne(req.body).exec().then(function(bot){
      if(!bot){
        //user not found
        res.status(404).json({error:"404: User not found, try again"})
      } else {
        //
        res.status(200).json(bot);
      }
    }).catch(function(err){
      res.status(500).json({error:err});
    })

    //If the request can't be served in 7
    //seconds returns res.end() to terminate request
    setTimeout(function(){
      console.log("408:Request Timeout");
      res.status(408).end();
    }, 7000);

});


//deletes bot data from db
router.delete("/bots/:id",function(req,res,next){
    //the Id specified in the url will be found and the
    //corresponding bot account data will be removed
    var ID = req.params.id;
    Bot.find({_id: ID}).deleteOne().exec().then(function(bot){
      if(!bot){
        res.status(404).json({error:"404: User not found, try again"})
      } else {
        res.status(200).json(bot);
      }
    }).catch(function(err){
      res.status(500).json({error:err});
    })
    //If the request can't be served in 7
    //seconds returns res.end() to terminate request
  setTimeout(function(){
    console.log("408:Request Timeout");
    res.status(408).end();
  }, 7000);
});


//*******************************************************//
//                   BOTS API REQUESTS
//*******************************************************//

//Returns ids and text of all tweets
router.get("/tweets",function (req,res,next) {
    Tweet.find().select(id,text).then(function(Tweet){
      if(!Tweet){
        res.status(204).json({
          error:"408: No tweets were found"
        })
      } else {
        res.status(200).json(Tweet)
      }
    }).catch(function(err){
      res.status(500).json({error:err});
    }); 
    setTimeout(function(){
      console.log("408:Request Timeout");
      res.status(408).end();
    }, 7000);
});

//returns data for the tweet corresponding to 
//the :id field in the request URL
router.get("/tweets/:id",function (req,res,next) {
  var ID = req.params.id;
  Tweet.find({id:ID}).then(function(Tweet){
    if(!Tweet){
      res.status(404).json({
        error:"404: tweet not found"
      })
    } else {
      res.status(200).json(Tweet)
    }
  }).catch(function(err){
    res.status(500).json({error:err});
  });
  //If the request can't be served in 7
  //seconds returns res.end() to terminate request
  setTimeout(function(){
    console.log("408:Request Timeout");
    res.status(408).end();
  }, 7000);
});

//Returns all tweets from the user corresponding
//to the :user_id field in the request url
router.get("/tweets/:user_Id", function(req,res,next){
  var user_id = req.params.user_id
  Tweet.find({user:{id:user_id}}).then(function(Tweet){
    if(!Tweet){
      res.status(404).json({
        error:"404: user not found"
      })
    } else {
      res.status(200).json(Tweet)
    }
  }).catch(function(err){
    res.status(500).json({error:err});
  });
  //If the request can't be served in 7
  //seconds returns res.end() to terminate request
  setTimeout(function(){
    console.log("408:Request Timeout");
    res.status(408).end();
  }, 7000);
})

//exports routes
module.exports = router;
