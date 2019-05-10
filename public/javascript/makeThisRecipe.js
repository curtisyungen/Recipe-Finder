var user = {
    userId: localStorage.getItem("userId"),
    userEmail: localStorage.getItem("userEmail"),
    userName: localStorage.getItem("userName"),
};

// =========================
// MAKE THIS RECIPE
// =========================

//** Event for when user clicks MAKE THIS RECIPE

$(document).on("click", ".makeThisRecipeBtn", function () {

    var $this = $(this);

    var savedRecipes = JSON.parse(localStorage.getItem("groceryList"));
    var recipeId = $this.attr("data-recipeId");

    if (savedRecipes) {

        selectedArray = savedRecipes;

        for (var i in savedRecipes) {
            if (recipeId == savedRecipes[i].id) {
                selectedRecipe = savedRecipes[i];
            }
        }
    }

    if (recipeArray) {

        for (var i in recipeArray) {
            if (recipeId == recipeArray[i].id) {
                selectedRecipe = recipeArray[i];
            }
        }
    }

    // Update class to toggle make/add button
    if ($this.attr("data-status") == "added") {

        // Update button classes and attributes
        $this
            .removeClass("btn btn-success")
            .addClass("btn btn-primary")
            .attr("data-status", "make")
            .text("Favorite");

        // Remove this recipe from grocery list
        removeFromGroceryList(selectedRecipe);

        $.ajax({
            headers: {
                "Content-Type": "application/json"
            },
            type: "DELETE",
            url: "/api/deleteRecipe/" + user.userId,
            data: JSON.stringify(selectedRecipe)
        })
            .then(function () {
                console.log("Done!");
            });
    }
    else if ($this.attr("data-status") == "make") {

        // Update button classes and attributes
        $this
            .removeClass("btn btn-primary")
            .addClass("btn btn-success")
            .attr("data-status", "added")
            .text("Favorited");

        // Add selected recipe to grocery list
        addToGroceryList(selectedRecipe);

        $.ajax({
            headers: {
                "Content-Type": "application/json"
            },
            type: "POST",
            url: "/api/postRecipe/" + user.userId,
            data: JSON.stringify(selectedRecipe)
        })
            .then(function () {
                console.log("Done!");
            });
    }
});