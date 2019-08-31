const express = require("express");
const router = express.Router();

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

router.get("/logout",function(req,res){
    //logs out
    req.logOut();
    //redirects to main page
    res.redirect("index");
})

router.get("/msg",function(req,res){
    res.render("message", {user:req.user});
});

router.get("/tof",function(req,res){
    res.render("thread_of_fate", {user:req.user} );
});

module.exports = router;