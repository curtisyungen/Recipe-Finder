var db = require("../models");
var axios = require("axios");

module.exports = function (app) {

  // ==========================================
  // GET
  // ==========================================

  // Get user by ID
  app.get("api/getUser/:id", function (req, res) {
    res.json(user);
  });

  // Get all routes specific to user
  app.get("/api/getRecipes/:userId", function (req, res) {
    db.Recipes
    .findAll({ 
      where: { 
        UserId: req.params.userId 
      } 
    })
    .then(function (response) {
      return res.json(response);
    });
  });

  // Get recipe by Recipe ID
  app.get("/api/getRecipeById/:id", function(req, res) {
    db.Recipes.findOne({ where: { recipeId: req.params.id } }).then(function(response) {
      return res.json(response);
    });
  });

  // ==========================================
  // POST
  // ==========================================

  // Post new recipe to database
  app.post("/api/postRecipe/:userId", function (req, res) {

    db.Recipes.create({
      recipeName: req.body.recipeName,
      recipeId: req.body.id,
      ingredients: req.body.ingredients.toString(),
      rating: req.body.rating,
      UserId: req.params.userId
    }).then(function (dbRecipe) {
      res.json(dbRecipe);
    });
  });

  // ==========================================
  // DELETE
  // ==========================================
  
  // Delete a recipe by id
  app.delete("/api/deleteRecipe/:userId", function (req, res) {
    db.Recipes
      .destroy({ 
        where: { 
          UserId: req.params.userId, 
          recipeId: req.body.recipeId 
        } 
      })
      .then(function (dbRecipe) {
        res.json(dbRecipe);
      });
  });

  // ==========================================
  // USER LOGIN
  // ==========================================

  // Create new user with a validation to check if that user's ID already exists in the database. 
  // Return false if an user with same email has been found
  app.post("/api/login", function (req, res) {

    var newUser = {};

    axios
      .get(
        "https://oauth2.googleapis.com/tokeninfo?id_token=" + req.body.idtoken
      )
      .then(function (response) {
        res.json(response.data);
        
        newUser = {
          name: response.data.name,
          email: response.data.email,
          id: response.data.sub
        };

      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        db.Users.findOrCreate({
          where: { id: newUser.id },
          defaults: {
            name: newUser.name,
            email: newUser.email
          }
        })
          .then(function (dbUser) {
            res.end(dbUser);
          });
      });
  });
};


