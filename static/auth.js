

function loginRemake(){

}

function signUp(){
    //var _email = document.getElementById("emailSignUp").value;
    //var _password = document.getElementById("passwordSignUp").value;
    fetch('../users',{
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "email": document.getElementById("emailSignUp").value,
            "password": document.getElementById("passwordSignUp").value
        })
    }).then((resp) => resp.json())
    .then(function(data){
        console.log(data);
        window.location.href = "../index.html";
        return true;
    })
    .catch( error => console.error(error));
    return false;
    //console.log("the email is: "+_email);
    //console.log("you clicked sign up");

}