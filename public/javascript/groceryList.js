// ===============================
// GLOBALS
// ===============================

var groceryList = [];
var ingrList;
var ingrListText;
var showHideBtn;
var viewRecipeBtn;
var deleteBtn;

// ===============================
// DUMMY RECIPE FOR DEVELOPMENT USE ONLY
// ===============================

var dummyRecipe = {
  recipeName: "Dummy Recipe",
  id: "1234",
  ingredients: ["ingr1", "ingr2", "ingr3", "ingr4", "ingr5"]
}

addToGroceryList(dummyRecipe);

// ===============================
// GET USER INFO FROM LOCAL STORAGE
// ===============================

var user = {
  userId: localStorage.getItem("userId"),
  userEmail: localStorage.getItem("userEmail"),
  userName: localStorage.getItem("userName")
};

// ===============================
// LOAD USER'S LIST UPON PAGE LOAD
// ===============================

function getGroceryList() {

    $.ajax({
        url: "/api/getUserRecipes/" + user.userId,
        method: "GET"
    })
        .then(function (response) {
            console.log(response);
        });
}

getGroceryList();

// ===============================
// ADD items to Grocery List
// ===============================

// This function is called when user chooses SELECT from recipe search results page

function addToGroceryList(recipe) {

  // console.log(recipe);

  if (recipe != "" && recipe != null && recipe != "undefined") {

    // Create div to hold ingredient list
    ingrList = $("<div>")
      .addClass("ingrList")
      .attr("data-name", recipe.recipeName)
      .attr("data-id", recipe.id)
      .attr("data-status", "closed");

    // Set up div to hold text for ingredient list
    // Separate div so it can be hidden when box is collapsed
    ingrListText = $("<div>")
      .addClass("ingrListText");

    // Populate list of ingredients
    for (var item in recipe.ingredients) {
      ingrListText
        .append(recipe.ingredients[item])
        .append("<br>");
    }

    // Store number of items in list for later height calculation
    ingrListText.attr("data-numItems", recipe.ingredients.length);

    // Create buttons
    viewRecipeBtn = $("<div>")
      .addClass("viewRecipeBtn")
      .addClass("fas fa-list-ul fa-2x");

    deleteBtn = $("<div>")
      .addClass("deleteBtn")
      .addClass("fas fa-times fa-2x");

    showHideBtn = $("<div>").addClass("fas fa-angle-down fa-2x showHideBtn");

    // Add recipe title and list of ingredients to list div
    ingrList
      .append(showHideBtn)
      .append(`<h4 class="gListName" data-recipeId="${recipe.id}">${recipe.recipeName}</h4>`)
      .append(ingrListText)
      .append(deleteBtn);

    // Add set of ingredients to grocery list
    $("#groceryList").append(ingrList);

    groceryList.push(ingrList);
  }
}

// ===============================
// REMOVE Recipe from Grocery List
// ===============================

// This function is called when user chooses to deselct recipe using button in Recipe Detail View

function removeFromGroceryList(recipe) {

  // var selectedArray = JSON.parse(localStorage.getItem("selectedArray"));
  var gList = $("#groceryList");
  var length = gList.children().length; 
  var index = -1; 
  
  // Find recipe in grocery list and store its index
  for (var i=0; i<length; i++) {

    if (gList.children()[i].dataset.id == recipe.id) {
      index = i;
    }
  }

  // Delete recipe div from grocery list
  gList.children()[index].remove();
}


// ===============================
// EXPAND / COLLAPSE ITEMS IN LIST
// ===============================

$(document).on("click", ".showHideBtn", showHideList);

function showHideList() {

  // Identify list whose button was clicked
  var targetList = $(this).parent();
  var showHideBtn = targetList.children(".showHideBtn");
  var listStatus = targetList.attr("data-status");

  // If list is collapsed, expand it
  if (listStatus == "closed") {

    // Calculate required height for expansion based on number of ingredients
    // 16 is font size
    // 50 is initial div height
    // 40 is padding-top and bottom
    var height = targetList.children(".ingrListText").attr("data-numItems") * 16 + 50 + 40 + 20;

    // Expand the list
    targetList.animate({
      height: height
    }, 500);

    // Flip arrow icon
    showHideBtn
      .removeClass("fas fa-angle-down")
      .addClass("fas fa-angle-up");

    // Fade in ingredient list
    targetList.children(".ingrListText")
      .show()
      .animate({
        opacity: 1
      }, 500);

    // Fade in delete button
    targetList.children(".deleteBtn")
      .show()
      .animate({
        opacity: 1
      }, 500);

    // Update attribute to show this div is expanded
    targetList.attr("data-status", "open");
  }

  // If list is expanded, collapse it
  else if (listStatus == "open") {

    // Collapse list
    targetList.animate({
      height: 50
    }, 500);

    // Flip arrow icon
    showHideBtn
      .removeClass("fas fa-angle-up")
      .addClass("fas fa-angle-down");

    // Fade out ingredient list
    targetList.children(".ingrListText")
      .animate({
        opacity: 0
      }, 500)
      .hide();

    // Fade out delete button
    targetList.children(".deleteBtn")
      .animate({
        opacity: 0
      }, 500)
      .hide();

    // Update attribute to show div is collapsed
    targetList.attr("data-status", "closed");
  }
}

// ===============================
// Grocery List Functionality
// ===============================

//** Event listener for when an ingredient is tapped by user

$(document).on("click", ".ingredient", crossOffList);

// This function toggles whether or not an item in grocery list is crossed out or not.
// Called when user taps individual item in list.

function crossOffList() {

  var ingredient = $(this);

  // If ingredient not yet crossed off, cross it off list
  if (ingredient.attr("data-crossed") == "false") {
    ingredient.css("color", "lightgray");
    ingredient.css("text-decoration", "line-through");
    ingredient.attr("data-crossed", "true");
  }

  // If ingredient already crossed off, uncross it
  else {
    ingredient.css("color", "#086DE0");
    ingredient.css("text-decoration", "none");
    ingredient.attr("data-crossed", "false");
  }
}

// =========================================
// DELETE Individual Entry from Grocery List
// =========================================

$(document).on("click", ".deleteBtn", function (event) {
  event.preventDefault();

  $(this).parent().remove();

});

// ===============================
// CLEAR Grocery List
// ===============================

// $(document).on("click", "#clearGroceryList", function (event) {
//   event.preventDefault();

//   $("#groceryList").empty();
//   $(".clipart").detach();

//   localStorage.removeItem("selectedArray");

//   $(".listButton").attr("disabled", true);
// });

// ======================================
// HIDE ALL Button for Grocery List
// ======================================

// $(document).on("click", "#hideAll", hideAll);

// function hideAll() {
//   Array.from(document.querySelector('#groceryList').children)
//     .forEach(item => {
//       if (item.expanded) {
//         item.hideExpansion();
//       }
//     });
// }

// ===============================
// EMAIL Grocery List
// ===============================

$("#email").on("click", function() {

  for (var item in groceryList) {

    let nodes = groceryList[item][0].children[2].childNodes;
    let recipeName = groceryList[item][0].children[1].innerText;
    let ingredients = [];

    for (var node in nodes) {
      if (nodes[node].data) {
        ingredients.push(nodes[node].data);
      }
    }

    console.log(recipeName, ingredients);
  }
});


