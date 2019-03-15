// =========================
// GLOBALS
// =========================

var searchLimit = 15;
var cuisine = "";
var diet = "";
var allergy = "";

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
    if ($("#searchInputBox").val() != "" && $("#searchInputBox").val() != null) {

        searchRecipes(searchLimit, cuisine, diet, allergy);

        $("#recipeList")
            .animate({
                opacity: 0.90
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

$(document).on("click", "#setFilter", setFilter);

function setFilter() {
    searchLimit = $("#numResults").val();
    cuisine = $("#cuisine").val();
    diet = $("#diet").val();
    allergy = $("#allergy").val();

    searchRecipes(searchLimit, cuisine, diet, allergy);
}

// EXECUTE SEARCH
// =========================

// Search Recipe URL Format: http://api.yummly.com/v1/api/recipes?_app_id=1280f0ef&_app_key=c6dea6bf830227615c86bf87458ee3a8&q=onion

function searchRecipes(searchLimit, cuisine, diet, allergy) {

    // Fade out recipe detail pane
    $("#recipeDetail").animate({
        opacity: 0
    }, 250);

    // Clear current recipe results
    $("#recipeList").empty();

    // Get search term
    var searchTerm = $("#searchInputBox").val().trim();

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
