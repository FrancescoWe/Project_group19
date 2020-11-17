var loggedUser;

function login(){
    //var email = document
    //get the form object
    var email = document.getElementById("loginEmail").value;
    console.log(email);

    fetch('../api/v1/users/' + email)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        console.log(data);
        //loggedUser = data[0];
        loggedUser=data;
        loggedUser.id = loggedUser.self.substring(loggedUser.self.lastIndexOf('/') + 1);
        document.getElementById("loggedUser").innerHTML = loggedUser.email;
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

}

function waitForElement(){
    var search = $('#searchbar').val();
    console.log(search);
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "./meteos/current/"+search,
        "method": "GET"
    }

    $.ajax(settings).done(function (response) {
        console.log(response);

        var name= response.name;		//prende la response name dal DB e la salva nella variabile name
        $("#name").append(name);

        var content = response.wind.speed;	//prende la response wind.speed dal DB e la salva nella variabile content
            $("#windSpeed").append(content);

        var currentWeather = response.weather[0].main;	//prende la response weather[0] cioè il tempo attuale dal DB e la salva nella variabile currentweather
            $("#currentWeather").append(currentWeather);

        $("#form").submit( function(res) {			//crea una variabile form che prende il risultato del submit di un bottone e lo salva dentro alla variabile search
            var search = $('#searchbar').val();
            // use the 'search' variable as needed here...
            // $.post('url...', { searchTerm: search });
        });
    });
}