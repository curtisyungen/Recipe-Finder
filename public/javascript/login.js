function onSignIn(googleUser) {
console.log("Signing in");
  var profile = googleUser.getBasicProfile();
  var id_token = googleUser.getAuthResponse().id_token;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/login');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  //var user = 
  xhr.onload = function () {
    var googleUserObject = JSON.parse(xhr.responseText);
    localStorage.setItem("userId", googleUserObject.sub);
    localStorage.setItem("userEmail", googleUserObject.email);
    localStorage.setItem("userName", googleUserObject.name);
    // document.location.href = '/';
  };
  xhr.send('idtoken=' + id_token); 
}