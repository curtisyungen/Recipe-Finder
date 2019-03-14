
// =========================
// VIEW RECIPE DETAILS
// =========================

//** Event for when user clicks on recipe in search results to view its DETAILS

$(document).on("click", ".recipeDiv", function () {

    var id = $(this).attr("id");

    $("#recipeDetail").animate({
        opacity: 0.90
    }, 100);

    showRecipeDetail(id);
});

function showRecipeDetail(id) {

    $("#recipeDetail").empty();

    var selectedRecipe;

    if (isNaN(id)) {
        for (var i in selectedArray) {
            if (selectedArray[i].id == id.id) {
                selectedRecipe = selectedArray[i];
            }
        }
    }
    else {
        selectedRecipe = recipeArray[id];
    }

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

            for (var i=0; i<$("#groceryList").children().length; i++) {

                if ($("#groceryList").children()[i].dataset.id == selectedRecipe.id) {

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