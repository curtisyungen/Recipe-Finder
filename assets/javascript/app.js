// =========================
// GLOBAL VARIABLES
// =========================
var APP_KEY = "c6dea6bf830227615c86bf87458ee3a8";
var APP_ID = "1280f0ef";
var recipeArray = [];
var selectedArray = [];

var searchLimit = 15;
var cuisine = "";
var diet = "";
var allergy = "";

// =========================
// FADE IN BACKGROUND IMAGE
// =========================

// Included this so user won't see choppy loading of background image
$(document).ready(function() {
    $("#backgroundContainer").on('webkitAnimationEnd', function(e) {
        $(this).addClass('visible');
    });
});

// ============================================================================================================================
// Yummly APIs: Search Recipe API, Get Recipe API
// Yummly API Documentation: https://developer.yummly.com/documentation
// ============================================================================================================================

// =========================
// SEARCH RECIPE
// =========================

$("#searchBtn").on("click", function (event) {
    event.preventDefault();

    // Clear search result list

    $("#recipeList").empty();
    recipeArray = [];

    // If search box isn't empty, run search for recipes
    if ($("#searchBox").val() != "" && $("#searchBox").val() != null) {

        searchRecipes();

        $("#recipeList")
            .animate({
                opacity: 1
            }, 500);
    }

    // If search box is empty and Search is clicked, hide Results and Detail view
    else {
        $("#recipeList, #recipeDetail").animate({
            opacity: 0
        }, 200);
    }
});

// APPLY FILTERS
// =========================

$(document).on("click", ".select", setFilter);

function setFilter() {
    searchLimit = $("#numResults").val() || "";
    cuisine = $("#cuisine").val() || "";
    diet = $("#diet").val() || "";
    allergy = $("#allergy").val() || "";
}

// EXECUTE SEARCH
// =========================

// Search Recipe URL Format: http://api.yummly.com/v1/api/recipes?_app_id=1280f0ef&_app_key=c6dea6bf830227615c86bf87458ee3a8&q=onion

function searchRecipes() {

    // Get search term
    var searchTerm = $("#searchBox").val().trim();

    if (searchTerm != "" && searchTerm != null) {

        // Compile search URL
        var searchRecipeUrl = `https://api.yummly.com/v1/api/recipes?_app_id=${APP_ID}&_app_key=${APP_KEY}&maxResult=${searchLimit}&q=${searchTerm}&allowedCuisine[]=cuisine^cuisine-${cuisine}&allowedDiet[]=${diet}&allowedAllergy[]=${allergy}`;

        // Execute Ajax request to find recipes
        $.ajax({
            url: searchRecipeUrl,
            method: "GET"
        })
            .then(function (response) {

                var recipe;

                for (var i = 0; i < searchLimit; i++) {

                    // Retrieve recipe from API response
                    recipe = response.matches[i];

                    // Add each recipe result to Recipe Array
                    recipeArray.push(recipe);

                    // Create a Div for each Recipe and store its attributes
                    var recipeDiv = $("<div>")
                        .addClass("recipeDiv")
                        .addClass("col-lg-6")
                        .attr("id", i);

                    // Display recipe image and name in div
                    recipeDiv.html(
                        `<img src=${recipe.smallImageUrls[0]}> 
                    <span>${recipe.recipeName}</span>`
                    );

                    // Add recipe to the results list
                    $("#recipeList").append(recipeDiv);
                }

                //console.log(recipeArray);
            });
    }
}

// =========================
// VIEW RECIPE DETAILS
// =========================

//** Event for when user clicks on recipe in search results to view its DETAILS

$(document).on("click", ".recipeDiv", function () {

    var id = $(this).attr("id");

    $("#recipeDetail").empty();

    $("#recipeDetail").animate({
        opacity: 1
    }, 100);

    showRecipeDetail(id);
});

function showRecipeDetail(id) {

    var selectedRecipe = recipeArray[id];

    // ======== GET RECIPE API QUERY ========

    var getRecipeUrl = `https://api.yummly.com/v1/api/recipe/${selectedRecipe.id}?_app_id=${APP_ID}&_app_key=${APP_KEY}`;

    $.ajax({
        url: getRecipeUrl,
        method: "GET",
    })
        .then(function (response) {

            $(".recipeDetail")
                .animate({
                    opacity: 0
                }, 200);


            // ======== LARGER IMAGE ========

            var largeImg = $("<img>");
            largeImg.addClass("recipeDetailImg");
            largeImg.attr("src", response.images[0].hostedLargeUrl);


            // ======== RECIPE NAME ========

            var recipeName = $("<div class='detail' id='detailTitle'>");
            recipeName.html(`<h4>${selectedRecipe.recipeName}</h4>`);


            // ======== RATING ========

            var rating = $("<div class='detail'>");

            for (var i = 0; i < 5; i++) {
                var star = $("<span class='fa fa-star'>");

                if (i < selectedRecipe.rating) {
                    star.addClass("checked");
                }

                rating.append(star);
            }


            // ======== MAKE THIS RECIPE BUTTON ========

            var buttonClass = "btn btn-primary btn-sm";
            var buttonText = "Make This Recipe";
            var buttonStatus = "make";

            // Check if recipe is already in Grocery List by searching for its ID in Selected Array
            for (var item in selectedArray) {
                if (selectedArray[item].id == selectedRecipe.id) {
                    buttonClass = "btn btn-success btn-sm";
                    buttonText = "Added to List";
                    buttonStatus = "added";
                }
            }

            // Create Make This Recipe button
            var makeThisRecipe = $("<div>")
                .addClass("makeThisRecipeBtn")
                .addClass(buttonClass)
                .attr("data-recipeArrayIdx", id)
                .attr("data-status", buttonStatus)
                .text(buttonText);


            // ======== SERVINGS ========

            selectedRecipe.servings = response.numberOfServings;
            var servings = $("<div class='detail'>");
            servings.html(`<h4 class='title'>Servings</h4> ${selectedRecipe.servings}`);


            // ======== INGREDIENTS ========

            var ingredients = $("<div class='detail'>");
            ingredients.html(`<h4 class="title">Ingredients</h4>`);

            for (var i = 0; i < selectedRecipe.ingredients.length; i++) {
                var ingr = $("<div>");
                ingr.text(response.ingredientLines[i]);
                ingredients.append(ingr);
            }

            selectedRecipe.ingredientLines = response.ingredientLines;


            // ======== SOURCE INFO ========

            var sourceDiv = $("<div id='sourceDiv'>");

            var source = $("<a class='source'>");

            source.addClass("detail source");
            source.attr("href", `${response.source.sourceRecipeUrl}`);
            source.text("Link to Recipe Source");
            sourceDiv.append(source);

            selectedRecipe.source = response.source.sourceRecipeUrl;


            // ======== NUTRITION INFO ========

            var nutritionInfo = response.nutritionEstimates;

            var nutritionContainerDiv = $("<div class='detail'>");

            // Search Terms found in API result (attributes)
            var nutrientArray = ["FAT_KCAL", "SUGAR", "FIBTG", "CHOCDF",
                "VITC", "CA", "PROCNT", "FE"];

            // Labels corresponding to Search Terms
            var labelArray = ["Fat", "Sugar", "Fiber", "Carbs",
                "Vitamin C", "Calcium", "Protein", "Iron"];

            nutritionContainerDiv.html("<h4 class='title'>Nutrition Info</h4>");

            // Loop through all elements in nutrition info (usually 50+ of them)
            for (var i = 0; i < nutritionInfo.length; i++) {
                var label = response.nutritionEstimates[i].attribute;

                // Look for element attribute names that match with the labels we're looking for (shown in nutrientArray)
                for (var j = 0; j < nutrientArray.length; j++) {

                    // If match found, compile and append to nutrition list
                    if (label == nutrientArray[j]) {

                        var nutr = $("<div>");

                        var newLabel = labelArray[j];
                        var nutrVal = response.nutritionEstimates[i].value;
                        var nutrUnit = response.nutritionEstimates[i].unit.plural;

                        nutr.text(`${newLabel}: ${nutrVal} ${nutrUnit}`);

                        nutritionContainerDiv.append(nutr);
                    }
                }
            }
            var perServing = $("<div id='perServing'>");
            perServing.text("Values shown are per serving");
            nutritionContainerDiv.append(perServing);


            // ======== CREATE RECIPE DETAIL WINDOW ========

            var recipeDetail = $("<div>");
            recipeDetail.addClass("recipeDetail");

            recipeDetail
                .append(recipeName)
                .append(sourceDiv)
                .append(largeImg)
                .append(rating)
                .append(makeThisRecipe)
                .append(servings)
                .append(ingredients)
                .append(nutritionContainerDiv);

            $("#recipeDetail")
                .append(recipeDetail);

            // Fade in recipe detail window
            $(".recipeDetail")
                .animate({
                    opacity: 1
                }, 500);
        });
}

// =========================
// MAKE THIS RECIPE
// =========================

//** Event for when user clicks MAKE THIS RECIPE

$(document).on("click", ".makeThisRecipeBtn", function () {

    var $this = $(this);

    // Get index of selected recipe in recipe array
    // This allows us to get its attributes
    var recipeArrayIdx = $this.attr("data-recipeArrayIdx");

    // Identify the recipe that was selected and store in variable
    var selectedRecipe = recipeArray[recipeArrayIdx];

    // Update class to toggle make/add button
    if ($this.attr("data-status") == "added") {

        // Remove this recipe from Selected Array
        var index = $this.attr("data-selectedArrIdx");
        selectedArray.splice(index, 1);
        
        // Update button classes and attributes
        $this
            .removeClass("btn btn-success")
            .addClass("btn btn-primary")
            .attr("data-status", "make")
            .attr("data-selectedArrayIdx", "-1")
            .text("Make This Recipe");

        // Remove this recipe from grocery list
        removeFromGroceryList(selectedRecipe);
    }
    else if ($this.attr("data-status") == "make") {

        // Push selected recipe to Selected Array
        selectedArray.push(selectedRecipe);

        // Update button classes and attributes
        $this
            .removeClass("btn btn-primary")
            .addClass("btn btn-success")
            .attr("data-status", "added")
            .attr("data-selectedArrIdx", selectedArray.length-1)
            .text("Added to List");

        // Add selected recipe to grocery list
        addToGroceryList(selectedRecipe);

        // localStorage.setItem("selectedArray", JSON.stringify(selectedArray));
    }

});

// ============================================================================================================================
// Google Images API
// Google API Documentation: https://developers.google.com/custom-search/docs/overview
// ============================================================================================================================

// $(document).on('click', '#changeDisplayType', function (event) {

//     event.preventDefault();

//     // Used to target the ingredients' parent div (for appending thumbnail to them)
//     let recipeDiv = $(this).parent();

//     let localStorageId = $(this).attr("data-localStorageId");
//     selectedArray = JSON.parse(localStorage.getItem("selectedArray"));

//     let recipe = selectedArray[localStorageId];

//     recipeDiv.empty();

//     // Key will be used to toggle between "View as Images" and "View as Text"
//     var key;

//     if ($(this).attr("data-displayType") == "text") {
//         key = "images";
//         getClipArt(recipe, recipeDiv);
//     }
//     else {
//         key = "text";
//         getText(recipe, recipeDiv);
//     }

//     // Create buttons

//     var imagesBtn = createImagesBtn(recipe, key);
//     var detailsBtn = createDetailsBtn(recipe);
//     var deleteBtn = createDeleteBtn(recipe);

//     recipeDiv.append(imagesBtn);
//     recipeDiv.append(detailsBtn);
//     recipeDiv.append(deleteBtn);

//     //console.log(recipeDiv);

// });

// // This function displays the ingredients in image format

// function getClipArt(recipe, recipeDiv) {

//     let ingrList = recipe.ingredients;

//     let API_KEY = "AIzaSyDJ90SaiND0l5GJlYS-rAnWNcWFZIoDNL8";

//     for (let i = 0; i < ingrList.length; i++) {

//         let queryURL = `https://www.googleapis.com/customsearch/v1?q=${ingrList[i]}&cx=003819080641655921957%3A-osseiuyk9e&imgType=clipart&num=1&searchType=image&key=${API_KEY}`;

//         $.ajax({
//             url: queryURL,
//             method: "GET",
//         })
//             .then(function (response) {

//                 let thumbnail = $('<img>');
//                 thumbnail.attr('src', response.items[0].image.thumbnailLink);
//                 thumbnail.attr('class', 'clipart');
//                 thumbnail.attr('data-x', 'false');

//                 thumbnail.css('height', '90px');
//                 thumbnail.css('width', '85px');
//                 thumbnail.css('margin', '10px');

//                 recipeDiv.prepend(thumbnail);
//             });
//     }
// }

// // This function displays the ingredients in text format

// function getText(recipe, recipeDiv) {
//     var ingrList = recipe.ingredientLines;

//     for (var i = recipe.ingredients.length; i >= 0; i--) {

//         var ingr = $("<h5 style='text-align:left;'>");
//         ingr.html(ingrList[i]);

//         ingr.addClass("ingredient");
//         ingr.attr("data-crossed", "false");

//         recipeDiv.prepend(ingr);
//     }

// }

// Toggles whether or not a clipart image in grocery list is crossed out or not.
// Called when user clicks individual image in list.

$(document).on('click', '.clipart', function () {
    let clipImg = $(this);

    if (clipImg.attr('data-x') == 'false') {
        // clipImg.css("color", "lightgray");
        clipImg.css('opacity', '0.07');
        clipImg.attr("data-x", "true");
    }

    else {
        clipImg.css('opacity', '1.0');
        clipImg.attr('data-x', 'false');
    }
});