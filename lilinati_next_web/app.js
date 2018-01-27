#!/etc/bin/evs node

var https = require('https');
var http = require('http');
var fs = require('fs');
//*****************************
//For local server require
//*****************************
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Competition = require("./models/competition");
var Comment = require("./models/comment");
var Competitor = require("./models/competitor");
var CompetitorNames = require("./models/competitorNames");
var User = require("./models/user");
//var logger = require("logger");
var multer = require("multer");

var competitionRoutes = require("./routes/competitions"),
    competitorRoutes = require("./routes/competitors"),
    commmentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");

//*****************************
// Set up the mongodb
//*****************************
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/lilinatiNext", {
    useMongoClient: true
});
//*****************************
// set up body-parser
//*****************************
app.use(bodyParser.urlencoded({
    extended: true
}));
//*****************************
// set up the ejs view engine
//*****************************
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
//*****************************
// set up method override
//*****************************
app.use(methodOverride("_method"));
//*****************************
// set up connect-flash
//*****************************
app.use(flash());
//*****************************
// set up logger
//*****************************
//app.use(logger());


//*****************************
//For Debian VPS key & cert
//*****************************
var options = {
    key: fs.readFileSync('/home/admin/conf/web/ssl.lilinatigallery.com.key'),
    cert: fs.readFileSync('/home/admin/conf/web/ssl.lilinatigallery.com.crt'),
    ca: fs.readFileSync('/home/admin/conf/web/ssl.lilinatigallery.com.ca')
};


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware to create globle varible for currentUser
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// set up routes
app.use("/", indexRoutes);
app.use("/competitions", competitionRoutes);
app.use("/competitions/:id/competitors", competitorRoutes);
app.use("/competitions/:id/comments", commmentRoutes);

//*****************************
//For local server listen
//*****************************
//app.listen(3000, function () {
//    console.log("Serving site on port 3000");
//});

//*****************************
//For Debian VPS server listen
//*****************************
var server = https.createServer(options, app);
server.listen(8002, function () {
    console.log("server running at https://IP_ADDRESS:8002/")
});
