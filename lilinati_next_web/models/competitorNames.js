var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/lilinatiNext", {
    useMongoClient: true
});

// schema set up
var competitorNamesSchema = new mongoose.Schema({
    compname: String
});

module.exports = mongoose.model("CompetitorNames", competitorNamesSchema);
