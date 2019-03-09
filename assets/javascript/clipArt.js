// ===============================
// CREATE VIEW AS IMAGES BUTTON
// ===============================

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