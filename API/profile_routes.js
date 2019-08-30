const express = require("express");
const router = express.Router();

router.get("/welcome", function (req, res) {
    //Checks if you are logged in or not
    if(!req.user){
        //User not logged in redirect to /loginFailed
        res.redirect("/profile/loginFailed");
    } else {
        //If logged in
        res.render("welcome", {bot:req.bot}); 
    }
});

//It could be useful to redirect to an intermediate route
//to keep track of how many times the login has Failed
router.get("/loginFailed", function(req,res){
    //to be implemented in the future
    res.redirect("/auth/twitter");
})

router.get("/msg",function(req,res){
    res.render("message", {bot:req.bot});
});

router.get("/tof",function(req,res){
    res.render("thread_of_fate", {bot:req.bot} );
});

module.exports = router;