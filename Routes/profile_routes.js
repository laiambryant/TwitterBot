const express = require("express");
const router = express.Router();
const Tw = require("../Services/twit");
const Utilities = require("../Services/Utility_Functions")


//Welcome Route
router.get("/welcome", function (req, res) {
    //Checks if you are logged in or not
    if(!req.user){
        //User not logged in redirect to /loginFailed
        res.redirect("/profile/loginFailed");
    } else {
        //If logged in
        res.render("welcome", {user:req.user}); 
    }
});

//It could be useful to redirect to an intermediate route
//to keep track of how many times the login has Failed
router.get("/loginFailed", function(req,res){
    //to be implemented in the future
    res.redirect("/auth/twitter");
})

//Logout route
router.get("/logout",function(req,res){
    //logs out
    req.session.destroy(function(err){
        console.log(err);
    })
    //redirect
    res.redirect("/");
})

//Message route
router.get("/msg",function(req,res){
    //If the user is not authenticated redirect to loginFailed
    if(!req.user){
        res.redirect("/profile/loginFailed");
    }else{
        res.render("message", {user:req.user});
    }
    });

//Thread of fate Logout
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
            Console.log("error");
        }
    }
});

var Tweet = function(Txt){
    var options = {
        status:Txt
    }
    Tw.post ("statuses/update", options, function(err,data,res){
        if (err){
            console.log(err);
        }else console.log(data);
    });
}



module.exports = router;