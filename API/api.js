const express = require("express");
const router = express.Router();
const Bot = require("../Models/bot");

//Get request
router.get('/bots', function(req,res,next){

    //If the request can't be served in 7
    //seconds returns res.end() to terminate request
    setTimeout(function(){res.status(404).end();}, 5000);
});

//creates new instance of Bot in the MongoDB database
router.post("/bots",function(req,res,next){

    Bot.create(req.body).catch(next);
    //If the request can't be served in 7
    //seconds returns res.end() to terminate request
    setTimeout(function(){res.status(404).end();}, 5000);
});

//updates bot data in the db
router.put("/bots/:id",function(req,res,next){
    //the id specified in the url will be found and the
    //corresponding bot account data will be updated
    var ID = req.params.id;
    Bot.find({_id:ID}).updateOne(req.body).exec();

    //If the request can't be served in 7
    //seconds returns res.end() to terminate request
    console.log("POST request ended");
  setTimeout(function(){res.status(404).end();}, 5000);

});


//deletes bot data from db
router.delete("/bots/:id",function(req,res,next){
    //the Id specified in the url will be found and the
    //corresponding bot account data will be removed
    var ID = req.params.id;
    Bot.find({_id: ID}).deleteOne().exec().then(function(bot){
      res.send(bot);
    });
    //If the request can't be served in 7
    //seconds returns res.end() to terminate request
  setTimeout(function(){res.status(404).end();}, 5000);
});

//exports routes
module.exports = router;
