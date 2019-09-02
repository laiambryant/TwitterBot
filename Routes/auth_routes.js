const router = require('express').Router();
const passport = require("passport");
const passport_setup = require("../Services/passport_setup").passport;

//redirects to twitter login
router.get("/twitter", passport.authenticate("twitter", {
  scope:["profile"]
}));


router.get('/twitter/callback', passport.authenticate('twitter', {failureRedirect: '/login'}),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/profile/welcome');
  },

);


module.exports = router;
