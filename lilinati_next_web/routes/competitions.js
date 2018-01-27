var express = require("express");
var router = express.Router();
var Competition = require("../models/competition");
var middleware = require("../middleware");

//INDEX - show all comptetitions
router.get("/", function (req, res) {
    //get all competitions from db
    Competition.find({}).sort({
        'competitionDate': 'desc'
    }).exec(function (err, allCompetitions) {
        if (err) {
            console.log(err);
        } else {
            res.render("competitions/index", {
                competitions: allCompetitions,
                currentUser: req.user
            });
        }
    });
});

//CREATE - add new competition to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
    //get data from form and add to competitions array
    var competitionName = req.body.competitionName;
    var cityImage = req.body.cityImage;
    var competitionDescription = req.body.competitionDescription;
    var competitionDate = req.body.competitionDate;
    var competitionValue = req.body.competitionValue;
    var author = {
        id: req.user._id,
        username: req.user.username
    };



    //define the competition's properties
    var newCompetition = {
        competitionName: competitionName,
        cityImage: cityImage,
        competitionDescription: competitionDescription,
        competitionDate: competitionDate,
        competitionValue: competitionValue,
        author: author
    };

    //Create a new campground and save to DB
    Competition.create(newCompetition, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/competitions");
        }
    });
});

//NEW - show form to create new competition
router.get("/new", middleware.isLoggedIn, middleware.isAuth, function (req, res) { 
   res.render("competitions/new");
});

//SHOW - shows more info about one competition
router.get("/:id", function (req, res) {
    //find the competition with provided ID
    Competition.findById(req.params.id).populate("comments").populate("competitors").exec(function (err, foundCompetition) {
        if (err || !foundCompetition) {
            req.flash("error", "Competition not found!");
            res.redirect("back");
        } else {
            console.log(foundCompetition);
            //render show template with that competition 
            res.render("competitions/show", {
                competition: foundCompetition
            });
        }
    });
});

//EDIT competition route
router.get("/:id/edit", middleware.checkCompetitionOwnership, function (req, res) {
    //find the competition with the requested id
    Competition.findById(req.params.id, function (err, foundCompetition) {
        if (err) {
            console.log(err)
        } else {
            res.render("competitions/edit", {
                competition: foundCompetition
            });
        }
    })
});

//UPDATE competition route
router.put("/:id", middleware.checkCompetitionOwnership, function (req, res) {
    Competition.findByIdAndUpdate(req.params.id, req.body.competition, function (err, foundCompetition) {
        if (err) {
            res.redirect("/competitions");
        } else {
            res.redirect("/competitions/" + req.params.id);
        }
    })
});

//DESTROY competition route
router.delete("/:id", middleware.checkCompetitionOwnership, function (req, res) {
    Competition.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/competitions");
        } else {
            res.redirect("/competitions");
        }
    })
});

module.exports = router;
