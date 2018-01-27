var express = require("express"),
    router = express.Router({
        mergeParams: true
    }),
    Competition = require("../models/competition"),
    Competitor = require("../models/competitor"),
    CompetitorNames = require("../models/competitorNames"),
	middleware = require("../middleware");


//competitors NEW
router.get("/new", middleware.isLoggedIn, function (req, res) {
    //find campground by id
    Competition.findById(req.params.id, function (err, competition) {
        if (err) {
            console.log(err);
        } else {
            res.render("competitors/new", {
                competition: competition
            });
        }
    });

});

//competitors CREATE
router.post("/", middleware.isLoggedIn, function (req, res) {
    //lookup competition using ID
    Competition.findById(req.params.id, function (err, competition) {
        if (err) {
            console.log(err);
            res.redirect("/competitions");
        } else {
		    //create new competitor
            Competitor.create(req.body.competitor, function (err, competitor) {
                if (err) {
					req.flash("error", "Something went wrong!");
                    console.log(err);
                } else {
                    //add username and id to competitor
					competitor.author.id = req.user._id;
					competitor.author.username = req.user.username;

                    var competitorName = req.body.competitorName;
                    var appearanceVideoImage = req.body.appearanceVideoImage;
                    var appearanceVideoLink = req.body.appearanceVideoLink;
                    var appearanceDescription = req.body.appearanceDescription;

                    var newCompetitor = {
                        competitorName: competitorName,
                        appearanceVideoImage: appearanceVideoImage,
                        appearanceVideoLink: appearanceVideoLink,
                        appearanceDescription: appearanceDescription
                    };
                    //save competitor
                    competitor.save();
					
					//connect new competitor to competition
                    competition.competitors.push(competitor);
                    competition.save();
					
					// redirect to the SHOW router
                    req.flash("success", "Successfully added competitor!");
                    res.redirect("/competitions/" + competition._id);
                }
            });
        }
    });

});

// edit competitor route
router.get("/:competitor_id/edit", middleware.checkCompetitorOwnership, function (req, res) {
    // found the competition by requested id
    Competition.findById(req.params.id, function (err, foundCompetition) {
        if (err || !foundCompetition) {
            req.flash("error", "Competition not found");
            return res.redirect("back");
        }
        Competitor.findById(req.params.competitor_id, function (err, foundCompetitor) {
            if (err) {
                res.redirect("back");
            } else {
                // if found, render the edit form and parse the campground and comment object
                res.render("competitors/edit", {
                    competition_id: req.params.id,
                    competitor: foundCompetitor
                });
            }
        });
    });

});

// update competitor route
router.put("/:competitor_id", middleware.checkCompetitorOwnership, function (req, res) {
    // find competitor with given requested competitor_id and update the competitor
    Competitor.findByIdAndUpdate(req.params.competitor_id, req.body.competitor, function (err, updatedCompetitor) {
        if (err) {
            res.redirect("back");
        } else {
            // redirect to the show page for the competition
            res.redirect("/competitions/" + req.params.id);
        }
    });
});

// competitor destroy route
router.delete("/:comment_id", middleware.checkCompetitorOwnership, function (req, res) {
    // find the given comment with id and remove it from database
    Competitor.findByIdAndRemove(req.params.competitor_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            // show flash message and redirect to show if successfully deleted 
            req.flash("success", "Competitor deleted!");
            res.redirect("/competitions/" + req.params.id);
        }
    });
});

module.exports = router;
