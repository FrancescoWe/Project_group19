

function loginRemake(){
    console.log(document.getElementById("emailLogin").value);
    console.log(document.getElementById("passwordLogin").value);
    fetch('../users/login',{
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "email": document.getElementById("emailLogin").value,
            "password": document.getElementById("passwordLogin").value
        })
    }).then((resp) => resp.json())
    .then(function(data){
        console.log(data);
        if(data.error!=null){
            console.log("ERROR");
            return false;
        }else{
            //console.log(data);
            window.location.href = "../itinerary.html";
            return true;
        }
    })
    .catch(error => console.error(error));
    return false;
    
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
        if(data.error!=null){
            console.log("ERROR");
            return false;
        }else{
            console.log(data);
            window.location.href = "../index.html";
            return true;
        }
    })
    .catch( error => console.error(error));
    return false;
    //console.log("the email is: "+_email);
    //console.log("you clicked sign up");

}