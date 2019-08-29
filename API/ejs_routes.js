const express = require("express");
const router = express.Router();

router.get("/", function(req,res){
    res.render("index");
});

router.get("/auth/welcome", function (req, res) {
   res.render("welcome"); 
});

router.get("/login", function(req,res){
    res.render("LoginFailed")
})



module.exports = router;