
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAVEWDjBxoO34B2bXEemxxnRpBE6Ztj8DQ",
  authDomain: "zeuswalletdb.firebaseapp.com",
  databaseURL: "https://zeuswalletdb.firebaseio.com",
  projectId: "zeuswalletdb",
  storageBucket: "zeuswalletdb.appspot.com",
  messagingSenderId: "513020898097"
};
firebase.initializeApp(config);


var register = document.getElementById('proceed');
var login = document.getElementById('logbut');

proceed.addEventListener('click',function(){

  var emailField = document.getElementById('email').value;
  var passwordField = document.getElementById('pwd').value;

  firebase.auth().createUserWithEmailAndPassword(emailField, passwordField).then(function(){

    document.getElementById("proceed").style.visibility = "hidden"; //hide input password
    document.getElementById("cancel").style.visibility = "hidden"; //hide input email
    document.getElementById("poptext").style.visibility = "hidden"; //display loading
    document.getElementById("loading").style.visibility = "visible"; //display loading
    setTimeout(function(){
        alert("Account Created!");
          document.location.href= 'LogIn.html';
    }, 3000); //3 seconds countdown
  }).catch(function(error){

    if(error != null){
    console.log(error.message);
    alert(error.message);
    return;
    }
  });
});

function EnterKey() //Check if submit button is pressed if yes run checkSubmit()
{
  if(event.keyCode == 13){ //JS keyCode 13 = Enter button
    checkSubmit();
  }

}


function checkSubmit(){
  var emailField = document.getElementById('emailCheck').value;
  var passwordField = document.getElementById('pwdCheck').value;
  firebase.auth().signInWithEmailAndPassword(emailField,passwordField).then(function(){
    document.getElementById("pwdCheck").style.visibility = "hidden"; //hide input password
    document.getElementById("emailCheck").style.visibility = "hidden"; //hide input email
    document.getElementById("loading").style.visibility = "visible"; //display loading
    var uid =firebase.uid;
    setTimeout(function(){
      window.location = "Dashboard.html";
    }, 3000); //3 seconds countdown
  }).catch(function(error){
    if(error != null){
      alert("Wrong Email Or Password");
      return;
    }
  });
};
