const express = require("express");
const router = express.Router();
const Bot = require("../Models/bot");

//Get request
router.get('/bots', function(req,res,next){
    Bot.find({}).exec().then(function(bots){
      if(!bots){
        res.status(204).json({error:"There are no bots in the DB"});
      }else{
        res.status(200).send(bots);
      }
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
  Bot.find({}).select("tw_name").exec().then(function(doc){
    res.status(200).json(doc);
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
  Bot.find({}).select("tw_id_str").exec().then(function(doc){
    res.status(200).json(doc);
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

//Get request
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
      
    }).catch(err=>console.log(err));
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
      //id not valid
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


//exports routes
module.exports = router;
