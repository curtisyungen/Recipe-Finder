// =========================
// GLOBAL VARIABLES
// =========================
var APP_KEY = "c6dea6bf830227615c86bf87458ee3a8";
var APP_ID = "1280f0ef";
var recipeArray = [];
var selectedArray = [];


$(document).on("click", ".gListName", showRecipeDetailFromList);

function showRecipeDetailFromList() {
    var id = $(this).attr("data-recipeId");

    var recipe = {
        id: id
    }

    showRecipeDetail(recipe);
}

// =========================
// FADE IN BACKGROUND IMAGE
// =========================

// Included this so user won't see choppy loading of background image
// $(document).ready(function() {
//     $("#backgroundContainer").on('webkitAnimationEnd', function(e) {
//         $(this).addClass('visible');
//     });
// });

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