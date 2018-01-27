// all middlewares are here
var Competition = require("../models/competition");    
var Comment    = require("../models/comment");
var Competitor = require("../models/competitor");
var User = require("../models/user");

// declare a empty middleware object
var middlewareObj = {};

// middleware to detect if the user is logged in
middlewareObj.isLoggedIn = function (req, res, next) {    
 if (req.isAuthenticated())
        return next();
    
    // send flash message for the next request if error
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
} 

//middleware to check if user can access route
middlewareObj.isAuth = function (req, res, next){
if (req.isAuthenticated()) {
        // find the campground with the requested id
        User.findById(req.user.id, function (err, foundUser) {
            console.log(req.user.id);
            if (err || req.user.id != '59ec6dfe3e0bdd5899ebbf36') {
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            } else {
                // does the user own the campground?
                if (req.user.id = '59ec6dfe3e0bdd5899ebbf36') {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        // send flash notification to user to log in first
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}


// middleware to check if the user has the campground ownership
middlewareObj.checkCompetitionOwnership = function (req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        // find the campground with the requested id
        Competition.findById(req.params.id, function (err, foundCompetition) {
            if (err || !foundCompetition) {
                req.flash("error", "Competition not found!");
                res.redriect("back");
            } else {
                // does the user own the campground?
                if (foundCompetition.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        // send flash notification to user to log in first
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

// middleware to check if the user has the comment ownership
middlewareObj.checkCommentOwnership = function (req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        // find the competition with the requested id
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err || !foundComment) {
                req.flash("error", "Comment not found");
                res.redriect("back");
            } else {
                // does the user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        // send flash notification to user to log in first
        req.flash("error", "You don't have permission to do that!");
        res.redirect("back");
    }
};


// middleware to check if the user has the competitor ownership
middlewareObj.checkCompetitorOwnership = function (req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        // find the competition with the requested id
        Competitor.findById(req.params.competitor_id, function (err, foundCompetitor) {
            if (err || !foundCompetitor) {
                req.flash("error", "Competitor not found");
                res.redriect("back");
            } else {
                // does the user own the comment?
                if (foundCompetitor.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        // send flash notification to user to log in first
        req.flash("error", "You don't have permission to do that!");
        res.redirect("back");
    }
};

module.exports = middlewareObj;
