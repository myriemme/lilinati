var express = require("express"),
    router = express.Router({
        mergeParams: true
    }),
    Competition = require("../models/competition"),
    Comment = require("../models/comment"),
	middleware = require("../middleware");




//comments NEW
router.get("/new", middleware.isLoggedIn, function (req, res) {
    //find competition by id
    Competition.findById(req.params.id, function (err, competition) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {
                competition: competition
            });
        }
    });

});

//comments CREATE
router.post("/", middleware.isLoggedIn, function (req, res) {
    //lookup competition using ID
    Competition.findById(req.params.id, function (err, competition) {
        if (err) {
            console.log(err);
            res.redirect("/competitions");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
					req.flash("error", "Something went wrong!");
                    console.log(err);
                } else {
                    //add username and id to comment                    
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
					
                    //save comment
                    comment.save();
					
					 // connect new comment to competition
                    competition.comments.push(comment);
                    competition.save();
					
					 // redirect to the SHOW router
					req.flash("success", "Successfully added comment!");
                    res.redirect("/competitions/" + competition._id);
                }
            });
        }
    });

});

// edit comment route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    // found the comment by requested id
    Competition.findById(req.params.id, function (err, foundCompetition) {
        if (err || !foundCompetition) {
            req.flash("error", "Competition not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                // if found, render the edit form and parse the competition and comment object
                res.render("comments/edit", {
                    competition_id: req.params.id,
                    comment: foundComment
                });
            }
        });
    });

});

// update comment route
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    // find comment with given requested comment_id and update the comment
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            // redirect to the show page for the competition
            res.redirect("/competitions/" + req.params.id);
        }
    });
});

// comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    // find the given comment with id and remove it from database
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            // show flash message and redirect to show if successfully deleted 
            req.flash("success", "Comment deleted!");
            res.redirect("/competitions/" + req.params.id);
        }
    });
});


module.exports = router;
