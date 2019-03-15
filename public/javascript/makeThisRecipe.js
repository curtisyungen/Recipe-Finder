// ===============================
// GET USER INFO FROM LOCAL STORAGE
// ===============================

var user = {
    userId: localStorage.getItem("userId"),
    userEmail: localStorage.getItem("userEmail"),
    userName: localStorage.getItem("userName")
};

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
            .attr("data-selectedArrIdx", selectedArray.length - 1)
            .text("Added to List");

        // Add selected recipe to grocery list
        addToGroceryList(selectedRecipe);

        // localStorage.setItem("selectedArray", JSON.stringify(selectedArray));
    }

});