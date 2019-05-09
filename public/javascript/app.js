// =========================
// GLOBAL VARIABLES
// =========================
var APP_KEY = "c6dea6bf830227615c86bf87458ee3a8";
var APP_ID = "1280f0ef";
var recipeArray = [];
var selectedArray = [];

// ===============================
// GET USER INFO FROM LOCAL STORAGE
// ===============================

var user = {
  userId: localStorage.getItem("userId"),
  userEmail: localStorage.getItem("userEmail"),
  userName: localStorage.getItem("userName")
};

// ===============================
// DISPLAY RECIPE DETAIL FROM G-LIST
// ===============================

$(document).on("click", ".gListName", showRecipeDetailFromList);

function showRecipeDetailFromList() {
    var id = $(this).attr("data-recipeId");
    var savedRecipes = JSON.parse(localStorage.getItem("groceryList"));

    console.log(savedRecipes[0].id);

    for (var i in savedRecipes) {
      if (id == savedRecipes[i].id) {
        showRecipeDetail(savedRecipes[i].id);
      }
    }

    
    
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

// =========================
// GOOGLE SIGN OUT
// =========================
var auth2;

window.onLoadCallback = function () {
  gapi.load('auth2', function () {
    auth2 = gapi.auth2.init({
      client_id: '894965613215-inve9sto28jrujo1kshpeao4gm2e8hdb.apps.googleusercontent.com',
      scope: 'profile',
      fetch_basic_profile: false
    });
  });
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    document.location.href = '/';
  });
}