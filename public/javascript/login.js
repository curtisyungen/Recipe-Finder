function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/login');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    var googleUserObject = JSON.parse(xhr.responseText);
    localStorage.setItem("userId", googleUserObject.sub);
    localStorage.setItem("userEmail", googleUserObject.email);
    localStorage.setItem("userName", googleUserObject.name);
    document.location.href = '/home';
  };
  xhr.send('idtoken=' + id_token); 
}