const express = require("express");
const router = express.Router();

router.get("/welcome", function (req, res) {
    if(!req.bot){
        //User not logged in
        res.redirect(URL + "/auth/login");
    } else {
        //If logged in
        res.render("welcome", {bot:req.bot}); 
    }
});

router.get("/loginFailed", function(req,res){
    res.redirect("/auth/twitter");
})



module.exports = router;