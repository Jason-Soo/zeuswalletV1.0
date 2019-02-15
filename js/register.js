function EnterKey() //Check if submit button is pressed if yes run checkSubmit()
{
  if(event.keyCode == 13){ //JS keyCode 13 = Enter button
    submitForm();
  }

}



function submitForm(){

 var emailCheck = document.getElementById('email').value;
 var pwdCheck = document.getElementById('pwd').value;
 var repwdCheck = document.getElementById('repwd').value;

if (emailCheck == "")
  {
    alert("Please Enter Your Email Below");
    return false;
  }


else if (pwdCheck == "")
  {
    alert("Please Enter Your Password Below");
    return false;
  }


else if (repwdCheck == "" || repwdCheck !== pwdCheck)
  {
    alert("Please Retype Your Both Password");
    return false;
  }
  else {
    document.getElementById("proceed").style.visibility = "visible"; //show proceed button
    document.getElementById("cancel").style.visibility = "visible"; //show cancel button
    document.getElementById("poptext").style.visibility = "visible"; //show text
    }

}
