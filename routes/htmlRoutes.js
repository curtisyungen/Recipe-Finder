var db = require("../models");

module.exports = function (app) {

  // Login Page
  app.get("/", function(req, res) {
    res.render("index")
  });

  // Home Page
  app.get("/home", function(req, res) {
    res.render("index")
  });

};
