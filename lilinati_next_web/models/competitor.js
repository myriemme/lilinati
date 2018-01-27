var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/lilinatiNext", {
    useMongoClient: true
});

// schema set up
var competitorSchema = mongoose.Schema({
    competitorName: String,
    //    {
    //        id: {
    //            type: mongoose.Schema.Types.ObjectId,
    //            ref: "CompetitorNames"
    //        },
    //        name: String
    //    },
    appearanceVideoImage: String,
    appearanceVideoLink: String,
    appearanceDescription: String,
	author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});
// create competitor model using the schema and export it
module.exports = mongoose.model("Competitor", competitorSchema);
