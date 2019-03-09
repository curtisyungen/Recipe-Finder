// ============================================================================================================================
// GROCERY LIST
// ============================================================================================================================

// ===============================
// ADD items to Grocery List
// ===============================

var groceryList = [];
var ingrList;
var ingrListText;
var showHideBtn;

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

    showHideBtn = $("<div>").addClass("fas fa-angle-down fa-2x showHideBtn");

    // Add recipe title and list of ingredients to list div
    ingrList
      .append(showHideBtn)
      .append(`<h4>${recipe.recipeName}</h4>`)
      .append(ingrListText);

    // Add set of ingredients to grocery list
    $("#groceryList").append(ingrList);
  }

  // var ingrList = $("<div>");
  // ingrList.addClass("expandable-content");

  // // Get list of ingredients and ingredientLines from recipe object
  // var ingredients = recipe.ingredients;
  // var ingredientLines = recipe.ingredientLines;

  // // Create a div for each separate ingredient and add it to container div
  // for (var i = 0; i < ingredients.length; i++) {

  //   var ingr = $("<h5 style='text-align:left;'>");
  //   ingr.html(ingredientLines[i]);

  //   ingr.addClass("ingredient");
  //   ingr.attr("data-crossed", "false");

  //   ingrList.append(ingr);
  // }

  // // Create button to toggle between Image display and Text display
  // var displayTypeBtn = createImagesBtn(recipe, "text");
  // ingrList.append(displayTypeBtn);

  // // Create button to view Recipe Details
  // var detailsBtn = createDetailsBtn(recipe);
  // ingrList.append(detailsBtn);

  // // Create delete button
  // var deleteBtn = createDeleteBtn(recipe);
  // ingrList.append(deleteBtn);

  // onsListItem.append(ingrList);
  // $("#groceryList").append(onsListItem);

}

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
    var height = targetList.children(".ingrListText").attr("data-numItems") * 16 + 50 + 40;

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

    // Update attribute to show div is collapsed
    targetList.attr("data-status", "closed");
  }
}

// Creates button for toggling between Text and Image display for ingredient list

function createImagesBtn(recipe, key) {

  // Create View as Images button

  var displayBtn = $("<button>");
  var buttonText;

  if (key == "text") {
    buttonText = "View as Images";
    displayBtn.attr("data-displayType", "text");
  }
  else {
    buttonText = "View as Text";
    displayBtn.attr("data-displayType", "images");
  }

  displayBtn.text(buttonText);
  displayBtn.attr("id", "changeDisplayType");
  displayBtn.attr("data-localStorageId", recipe.localStorageId);
  //console.log(button);

  return displayBtn;
}

// Creates button for accessing Recipe Detail View from Grocery List

function createDetailsBtn(recipe) {

  var detailsButton = $("<button>");
  detailsButton.text("View Details");
  detailsButton.addClass("viewDetails");
  detailsButton.attr("id", recipe.id);

  return detailsButton;
}

// Creates button for deleting individual recipe from Grocery List

function createDeleteBtn(recipe) {

  var deleteButton = $("<button>");
  deleteButton.text("Delete");
  deleteButton.addClass("deleteBtn");
  deleteButton.attr("id", recipe.id);

  return deleteButton;
}

// ===============================
// REMOVE Recipe from Grocery List
// ===============================

// This function is called when user chooses to deselct recipe using button in Recipe Detail View

function removeFromGroceryList(recipe) {

  //console.log(recipe);

  var selectedArray = JSON.parse(localStorage.getItem("selectedArray"));

  for (var i = 0; i < selectedArray.length; i++) {
    if (selectedArray[i].id == recipe.id) {
      selectedArray[i] = "";
    }
  }

  localStorage.setItem("selectedArray", JSON.stringify(selectedArray));

  $(`#${recipe.id}`).remove();
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

// ===============================
// CLEAR Grocery List
// ===============================

$(document).on("click", "#clearGroceryList", function (event) {
  event.preventDefault();

  $("#groceryList").empty();
  $(".clipart").detach();

  localStorage.removeItem("selectedArray");

  $(".listButton").attr("disabled", true);
});

// ======================================
// HIDE ALL Button for Grocery List
// ======================================

$(document).on("click", "#hideAll", hideAll);

function hideAll() {
  Array.from(document.querySelector('#groceryList').children)
    .forEach(item => {
      if (item.expanded) {
        item.hideExpansion();
      }
    });
}

// ======================================
// View RECIPE DETAILS from Grocery List
// ======================================

$(document).on("click", ".viewDetails", callGetRecipeDetails);

function callGetRecipeDetails() {

  selectedArray = JSON.parse(localStorage.getItem("selectedArray"));
  var localStorageId;

  for (var i = 0; i < selectedArray.length; i++) {
    if ($(this).attr("id") == selectedArray[i].id) {
      localStorageId = i;
    }
  }

  var selectedRecipe = selectedArray[localStorageId];

  getRecipeDetail(localStorageId, selectedRecipe);
}

// =========================================
// DELETE Individual Entry from Grocery List
// =========================================

$(document).on("click", ".deleteBtn", function (event) {
  event.preventDefault();

  selectedArray = JSON.parse(localStorage.getItem("selectedArray"));
  var localStorageId;

  for (var i = 0; i < selectedArray.length; i++) {
    if ($(this).attr("id") == selectedArray[i].id) {
      localStorageId = i;
    }
  }

  var deleteRecipe = selectedArray[localStorageId];

  removeFromGroceryList(deleteRecipe);

  if ($("#groceryList").children().length == 0) {
    $(".listButton").attr("disabled", true);
  }

});

