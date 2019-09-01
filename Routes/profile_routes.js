const express = require("express");
const router = express.Router();

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
    if(!req.user){
        res.redirect("/profile/loginFailed");
    }else{
        res.render("message", {user:req.user});
    }
    });

//Thread of fate Logout
router.get("/tof",function(req,res){
    if(!req.user){
        res.redirect("/profile/loginFailed");
    }else{
        res.render("thread_of_fate", {user:req.user} );
    }
});

module.exports = router;