var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/lilinatiNext", {
    useMongoClient: true
});

// schema set up
var competitionSchema = new mongoose.Schema({

    competitionName: String,
    cityImage: String,
    competitionDescription: String,
    competitionDate: String,
    competitionValue: String,
    competitors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Competitor"
    }],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }

});



// create campground model using the schema and export it
module.exports = mongoose.model("Competition", competitionSchema);
