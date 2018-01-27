var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

//root route
router.get("/", function (req, res) {
    res.render("landing");
});

//register form route
router.get("/register", function (req, res) {
    res.render("register");
});

//handle sign up logic
router.post("/register", function (req, res) {
    //res.send("signing you up...");
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
             // display flash error message from the database
           req.flash("error", err.message);
           return res.render("register");
        }
        // authenticate the given user
        passport.authenticate("local")(req, res, function () {
            // display the welcome flash notification and redirect
            req.flash("success", "Welcome to LiliNatiNext " + user.username);
            res.redirect("/competitions");
        });
    });
});

// show login form
router.get("/login", function (req, res) {
    res.render("login");
});

// handling login logic with passport middleware
router.post("/login", passport.authenticate("local", {
    successRedirect: "/competitions",
    failureRedirect: "login"
}), function (req, res) {
    //res.send("login logic happens here");
});

// log out route
router.get("/logout", function (req, res) {
   req.logout();
   req.flash("success", "Logged you out!"); // handle logout flash msg
   res.redirect("/competitions");
});

// export the router module
module.exports = router;
