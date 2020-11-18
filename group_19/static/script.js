var loggedUser;
var daycount=0;
var searchbefore = "";

class Forecast{
    constructor(date, icon, maxTemp, minTemp){
        this.date=date;
        this.icon=icon;
        this.maxTemp=maxTemp;
        this.minTemp=minTemp;
    }
}

var cityForecast = [];

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

//seconda funzione per il forecast tramite le 5 immagini in basso 
function fiveDayForeCast(){
    var search = $('#searchbar').val();
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "./meteos/forecast/"+search,
        "method": "GET"
    }
    cityForecast=[];
    console.log(search);
    $.ajax(settings).done(function (response) {
        console.log(response);
        for(let i=0; i<response.list.length; i+=8){
            const tempName = response.list[i].dt_txt ;
            const icon = response.list[i].weather[0].icon;
            const temperatureMax = response.list[i].main.temp_max;
            const temperatureMin = response.list[i].main.temp_min;
            const windSpeed = response.list[i].wind.speed;
            const currentWeather = response.list[i].weather[0].main;
            /*console.log(tempName);
            //console.log(icon);
            console.log(temperatureMax);
            console.log(temperatureMin);
            console.log(windSpeed);
            console.log(currentWeather);*/
            const temporary = new Forecast(tempName, icon, temperatureMax, temperatureMin); 
            cityForecast.push(temporary);
            //console.log(temporary);
        }
        console.log(cityForecast);
        document.getElementById("data_uno").innerHTML = cityForecast[0].date;
        document.getElementById("imm_uno").src = "http://openweathermap.org/img/w/"+cityForecast[0].icon+".png";
        document.getElementById("max_uno").innerHTML = "Max: "+ cityForecast[0].maxTemp + "°";
        document.getElementById("min_uno").innerHTML = "Min: "+ cityForecast[0].minTemp + "°";
        
        document.getElementById("data_due").innerHTML = cityForecast[1].date;
        document.getElementById("imm_due").src = "http://openweathermap.org/img/w/"+cityForecast[1].icon+".png";
        document.getElementById("max_due").innerHTML = "Max: "+ cityForecast[1].maxTemp + "°";
        document.getElementById("min_due").innerHTML = "Min: "+ cityForecast[1].minTemp + "°";

        document.getElementById("data_tre").innerHTML = cityForecast[2].date;
        document.getElementById("imm_tre").src = "http://openweathermap.org/img/w/"+cityForecast[2].icon+".png";
        document.getElementById("max_tre").innerHTML = "Max: "+ cityForecast[2].maxTemp + "°";
        document.getElementById("min_tre").innerHTML = "Min: "+ cityForecast[2].minTemp + "°";

        document.getElementById("data_quattro").innerHTML = cityForecast[3].date;
        document.getElementById("imm_quattro").src = "http://openweathermap.org/img/w/"+cityForecast[3].icon+".png";
        document.getElementById("max_quattro").innerHTML = "Max: "+ cityForecast[3].maxTemp + "°";
        document.getElementById("min_quattro").innerHTML = "Min: "+ cityForecast[3].minTemp + "°";

        document.getElementById("data_cinque").innerHTML = cityForecast[4].date;
        document.getElementById("imm_cinque").src = "http://openweathermap.org/img/w/"+cityForecast[4].icon+".png";
        document.getElementById("max_cinque").innerHTML = "Max: "+ cityForecast[4].maxTemp + "°";
        document.getElementById("min_cinque").innerHTML = "Min: "+ cityForecast[4].minTemp + "°";
        /*const divC = document.createElement('div');
        const div = document.createElement('div');
        const h = document.createElement('h3');
        const hey = document.createElement('h2');

        hey.textContent = cityForecast[0].date;
        h.textContent= cityForecast[0].temperatureMax;
        divC.id='div_id';
        divC.innerHtml = h+"<h1>hello world</h1>";
        document.body.appendChild(divC);*/
    });
}