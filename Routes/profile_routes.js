const express = require("express");
const router = express.Router();
const Tw = require("../Models/tweet");
const Utilities = require("../Services/Utility_Functions")
const twit = require("../Services/twit");


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
    req.session.destroy((err)=>{
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



module.exports = router;