// require("dotenv").config();

// DEPENDENCIES
// ========================================
var express = require("express");
var exphbs = require("express-handlebars");
var path = require('path');
var axios = require("axios");

// MYSQL DATABASE
// ========================================
var db = require("./models");

var syncOptions = { force: false };

// Overwrite database if in test environment
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// ROUTES
// ========================================
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// SET UP EXPRESS
// ========================================
var app = express();
var PORT = process.env.PORT || 3000;

// SET UP HANDLEBARS
// ========================================
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// MIDDLEWARE
// ========================================
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// START SERVER
// ========================================
db.sequelize.sync(syncOptions).then(function () {
  app.listen(PORT, function () {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
