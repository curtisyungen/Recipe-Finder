// =========================
// MAKE THIS RECIPE
// =========================

//** Event for when user clicks MAKE THIS RECIPE

$(document).on("click", ".makeThisRecipeBtn", function () {

    var $this = $(this);
    
    var savedRecipes = JSON.parse(localStorage.getItem("groceryList"));
    var recipeId = $this.attr("data-recipeId");

    for (var i in savedRecipes) {
        if (recipeId == savedRecipes[i].id) {
            selectedRecipe = savedRecipes[i];
        }
    }

    selectedArray = savedRecipes;

    // Update class to toggle make/add button
    if ($this.attr("data-status") == "added") {

        // Update button classes and attributes
        $this
            .removeClass("btn btn-success")
            .addClass("btn btn-primary")
            .attr("data-status", "make")
            .attr("data-selectedArrayIdx", "-1")
            .text("Favorite");

        // Remove this recipe from grocery list
        removeFromGroceryList(selectedRecipe);
    }
    else if ($this.attr("data-status") == "make") {

        // Update button classes and attributes
        $this
            .removeClass("btn btn-primary")
            .addClass("btn btn-success")
            .attr("data-status", "added")
            .attr("data-selectedArrIdx", selectedArray.length - 1)
            .text("Favorited");

        // Add selected recipe to grocery list
        addToGroceryList(selectedRecipe);
    }

});