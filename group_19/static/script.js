var loggedUser;
var daycount=0;
var searchbefore = "";

var settings = {
    "async": true,
    "crossDomain": true,
    "url": "",
    "method": "GET"
}

document.getElementById('daysbutton').style.visibility="hidden";

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
    document.getElementById('daysbutton').style.visibility="hidden";
    document.getElementById('daynum').style.visibility="hidden";
    document.getElementById('hours').style.visibility="hidden";
    daycount=0;
    var search = $('#searchbar').val();
    console.log(search);

    settings.url = "./meteos/current/"+search;

    $.ajax(settings).done(function (response) {
        console.log(response);

        document.getElementById('daynum').innerHTML = "";

        var name= response.name;		//prende la response name dal DB e la salva nella variabile name
        document.getElementById('name').innerHTML = "City name : "+search;

        var content = response.wind.speed;	//prende la response wind.speed dal DB e la salva nella variabile content
        document.getElementById('windSpeed').innerHTML = "Wind speed: "+content;

        var currentWeather = response.weather[0].main;	//prende la response weather[0] cioè il tempo attuale dal DB e la salva nella variabile currentweather
        document.getElementById('currentWeather').innerHTML = "Current weather conditions : "+currentWeather;

        /*
        $("#form").submit( function(res) {			//crea una variabile form che prende il risultato del submit di un bottone e lo salva dentro alla variabile search
            var search = $('#searchbar').val();
            // use the 'search' variable as needed here...
            // $.post('url...', { searchTerm: search });
        });
        */
    });
}

function waitForElementForecast(){
    document.getElementById('daynum').style.visibility="visible";
    document.getElementById('hours').style.visibility="visible";
    if(daycount>39){
        document.getElementById('daysbutton').style.visibility="hidden";
        daycount=0;
        return;
    } else {
        document.getElementById('daysbutton').style.visibility="visible";
        document.getElementById('daysbutton').innerHTML = "+1 Days";
    }
    
    var search = $('#searchbar').val();

    if((daycount/8)>=1 && search!==searchbefore){
        document.getElementById('daynum').innerHTML = "City name changed";
        document.getElementById('daysbutton').style.visibility="hidden";
        return;
    }
    searchbefore = $('#searchbar').val();

    settings.url = "./meteos/forecast/"+search;

    $.ajax(settings).done(function (response) {
        console.log(response);

        document.getElementById('daynum').innerHTML = ((daycount/8)+1)+" days from now";

        var hours = String(response.list[daycount].dt_txt).substring(11,13);
        document.getElementById('hours').innerHTML = hours + ":00:00";

        console.log(hours);

        var name= response.city.name;		//prende la response name dal DB e la salva nella variabile name
        document.getElementById('name').innerHTML = "City name : "+search;

        var forecastwind = response.list[daycount].wind.speed;
        document.getElementById('windSpeed').innerHTML = "Wind speed: : "+forecastwind;

        var forecastWeather = response.list[daycount].weather[0].main;	//prende la response weather[0] cioè il tempo attuale dal DB e la salva nella variabile currentweather
        document.getElementById('currentWeather').innerHTML = "Weather : "+forecastWeather;

        /*
        $("#form").submit( function(res) {			//crea una variabile form che prende il risultato del submit di un bottone e lo salva dentro alla variabile search
            var search = $('#searchbar').val();
            // use the 'search' variable as needed here...
            // $.post('url...', { searchTerm: search });
        });
        */

    });
}

function addday(){
    daycount = daycount+8;
}