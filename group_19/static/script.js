var loggedUser;
var daycount=8;
var searchbefore = "";

var currentfetch;
var forecastfetch;

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

async function waitForElement(){
    document.getElementById('daysbutton').style.visibility="hidden";
    document.getElementById('daynum').style.visibility="hidden";
    document.getElementById('hours').style.visibility="hidden";
    daycount=0;
    var search = $('#searchbar').val();

    settings.url = "./meteos/current/"+search;

    let currentfetchresponse = await fetch(settings.url);
    currentfetch = await currentfetchresponse.json();

    //console.log(currentfetch);
    //console.log(search);

    var name= currentfetch.name;		//prende la response name dal DB e la salva nella variabile name
    var wind = currentfetch.wind.speed;	//prende la response wind.speed dal DB e la salva nella variabile content
    var mainWeather = currentfetch.weather[0].main;	//prende la response weather[0] cioè il tempo attuale dal DB e la salva nella variabile currentweather

    document.getElementById('name').innerHTML = "City name : "+name;
    document.getElementById('windSpeed').innerHTML = "Wind speed: "+wind;
    document.getElementById('currentWeather').innerHTML = "Current weather conditions : "+mainWeather;
    
}

function cityforecastCall(){
    daycount=8;
    searchbefore = $('#searchbar').val();
}

function addday(){
    daycount = daycount+8;
    if(daycount==40)     // protezione per non andare al di fuori dell' array "list" di 40 elementi
        daycount=39;
}

async function waitForElementForecast(){
    document.getElementById('daynum').style.visibility="visible";
    document.getElementById('hours').style.visibility="visible";
    document.getElementById('daysbutton').style.visibility="visible";
    document.getElementById('daysbutton').innerHTML = "+1 Days";

    var search = $('#searchbar').val();

    settings.url = "./meteos/forecast/"+search;

    if(daycount==8 && search==searchbefore) {                       //fa una fetch dall' api solo una volta (quando l' utente clicca sul bottone la prima volta) e dopo usa sempre gli stessi dati.
        let forecastfetchresponse = await fetch(settings.url);
        forecastfetch = await forecastfetchresponse.json();
    } else if(search!==searchbefore){           //Se l' utente cambia il nome della città in corso d' opera verrà fatta ripartire la funzione autonomamente.
        cityforecastCall();
        waitForElementForecast();
        return;
    }

    var hours = String(forecastfetch.list[daycount].dt_txt).substring(11,13);
    var name= forecastfetch.city.name;		//prende la response name dal DB e la salva nella variabile name
    var forecastwind = forecastfetch.list[daycount].wind.speed;
    var forecastWeather = forecastfetch.list[daycount].weather[0].main;	//prende la response weather[0] cioè il tempo attuale dal DB e la salva nella variabile currentweather

    document.getElementById('daynum').innerHTML = ((daycount/8)*24) + " hours from now";
    document.getElementById('hours').innerHTML = hours + ":00:00";
    document.getElementById('name').innerHTML = "City name : "+name;
    document.getElementById('windSpeed').innerHTML = "Wind speed: : "+forecastwind;
    document.getElementById('currentWeather').innerHTML = "Weather : "+forecastWeather;

    if(daycount==39){                 //se l' utente arriva a guardare tutti e 5 i giorni successivi, non potrà più cliccare il pulsante per andare avanti
        document.getElementById('daysbutton').style.visibility="hidden";
    }
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