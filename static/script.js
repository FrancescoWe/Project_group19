/* Non appena l'index.html viene caricato, questo script viene eseguito.
Tutta via le funzioni in esso definite verranno eseguite solo se richiamate dagli
eventi nell'index.html. */

// const { base } = require("../api/models/user");

// Variabili globali
var loggedUser;
var daycount;
var searchbefore = "";
var currentfetch;
var forecastfetch;

// Definizione della classe Forecast con rispettivo costruttore
class Forecast{
    constructor(date, icon, maxTemp, minTemp){
        this.date=date;
        this.icon=icon;
        this.maxTemp=maxTemp;
        this.minTemp=minTemp;
    }
}

var cityForecast = [];

// Definizione della strutture di "settings"
var settings = {
    "async": true,
    "crossDomain": true,
    "url": "",
    "method": "GET"
}

// I bottoni "<" e ">" vengono settati a hidden.
document.getElementById('daysbutton1').style.visibility="hidden";
document.getElementById('daysbutton2').style.visibility="hidden";

// DEFINIZIONI DELLE FUNZIONI

// Funzione per il login, verifica che la mail inserita corrisponda ad un utente.
function login(){
    //var email = document
    //Ottiene l'oggetto con id "loginEmail"
    var email = document.getElementById("loginEmail").value;
    console.log(email);

    fetch('../api/v1/users/' + email)   // Ricerca l'utente corrispondente a quella mail richiamando l'API di users
    .then((resp) => resp.json()) // Trasforma i dati in json
    .then(function(data) { // Qui inseriamo una funzione per modificare i dati a piacimento
        console.log(data);
        //loggedUser = data[0];
        loggedUser=data;    // Logged user contiene i dati ottenuti con la fetch e parsati in json
        loggedUser.id = loggedUser.self.substring(loggedUser.self.lastIndexOf('/') + 1);    // l'ID 
        document.getElementById("loggedUser").innerHTML = loggedUser.email + "<br>";    // Viene aggiornato l'innerHTML dell'elemento "loggedUser" in index.html
        return;
    })
    .catch( error => console.error(error) ); // Se c'è un qualsiasi errore viene catturato qui

}

// Funzione per il current meteo
async function waitForElement(){
    // I bottoni relativi al forecast non servono, vengono settati a hidden
    document.getElementById('daysbutton1').style.visibility="hidden";
    document.getElementById('daysbutton2').style.visibility="hidden";
    document.getElementById('daynum').style.visibility="hidden";
    document.getElementById('hours').style.visibility="hidden";
    daycount=0;
    var search = $('#searchbar').val();     // Recupera il testo inserito nel textfield con id "searchbar"
    settings.url = "./meteos/"+search; // Viene settato il campo url di settings

    let currentfetchresponse = await fetch(settings.url);   // Esegue una fetch dall'api all'URL "settings.url"
    currentfetch = await currentfetchresponse.json();       // La variabile currentfetch è currentfetchresponse parsata in json

    //console.log(currentfetch);
    //console.log(search);

    var name= currentfetch.name;		// Prende la response name dal DB e la salva nella variabile name
    var wind = currentfetch.current.wind_speed;	// Prende la response wind.speed dal DB e la salva nella variabile wind
    var mainWeather = currentfetch.current.weather[0].main;	// Prende la response weather[0] cioè il tempo attuale dal DB e la salva nella variabile mainWeather

    // Vengono aggiornati gli innerHTML delle tag div di index.html contenenti le informazioni sul meteo
    document.getElementById('name').innerHTML = "City name : "+name;
    document.getElementById('windSpeed').innerHTML = "Wind speed: "+wind;
    document.getElementById('currentWeather').innerHTML = "Current weather conditions : "+mainWeather;
    
}

function cityforecastCall(){
    forecastfetch = null;
    daycount=0;                             // Resetta la variabile daycount a 8
    searchbefore = $('#searchbar').val();   // Inizializza la variabile searchbefore con il testo del textfield 
}

function addday(){
    daycount += 1;
    if(daycount>6)
        daycount = 7;
}

function removeday(){
    daycount-=1;
    if(daycount<1)
        daycount = 0;
}

// Funzione per il forecast
async function waitForElementForecast(){
    document.getElementById('daynum').style.visibility="visible";
    document.getElementById('hours').style.visibility="visible";
    document.getElementById('daysbutton1').style.visibility="visible";
    document.getElementById('daysbutton2').style.visibility="visible";

    var search = $('#searchbar').val(); // Recupera il testo inserito nel textfield con id "searchbar"
    settings.url = "./meteos/"+search; // Viene settato il campo url di settings

    if(search==searchbefore && forecastfetch == null) {    // Esegue una fetch dall'api solo una volta (quando l'utente clicca sul bottone la prima volta) e dopo usa sempre gli stessi dati.
    let forecastfetchresponse = await fetch(settings.url);
    forecastfetch = await forecastfetchresponse.json();
} else if(search!==searchbefore){       // Se l' utente cambia il nome della città in corso d' opera verrà fatta ripartire la funzione autonomamente.
    forecastfetch = null;
    cityforecastCall();
    waitForElementForecast();
    return;
}

var name= forecastfetch.name;		//prende la response name dal DB e la salva nella variabile name
var forecastwind = forecastfetch.daily[daycount].wind_speed;
var forecastWeather = forecastfetch.daily[daycount].weather[0].main;	//prende la response weather[0] cioè il tempo attuale dal DB e la salva nella variabile currentweather

document.getElementById('daynum').innerHTML = (daycount+1) + " days from now";
document.getElementById('name').innerHTML = "City name : "+name;
document.getElementById('windSpeed').innerHTML = "Wind speed: : "+forecastwind;
document.getElementById('currentWeather').innerHTML = "Weather : "+forecastWeather;
}

// Seconda funzione per il forecast tramite le 5 immagini nella parte in basso della pagina /index.html
function fiveDayForeCast(){
    var search = $('#searchbar').val();
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "./meteos/"+search,
        "method": "GET"
    }
    cityForecast=[];
    console.log(search);
    $.ajax(settings).done(function (response) {
        for(let i=0; i<Object.keys(response.daily).length; i+=1){         // Ogni 8 oggetti della lista, ognuno dei quali rappresenta un intervallo di 3 ore, quindi ogni 24 ore
            let unix_timestamp = response.daily[i].dt;       // Data in formato testuale
            let icon = response.daily[i].weather[0].icon;  // Icona del meteo
            let temperatureMax = response.daily[i].temp.max;  // Temperatura massima
            let temperatureMin = response.daily[i].temp.min;  // Tempperatura minima
            let windSpeed = response.daily[i].wind_speed;          // Velocità del vento
            let currentWeather = response.daily[i].weather[0].main;// Tempo corrente (il main, un oggetto)   
            /*console.log(tempName);
            //console.log(icon);
            console.log(temperatureMax);
            console.log(temperatureMin);
            console.log(windSpeed);
            console.log(currentWeather);*/
            let date = new Date(unix_timestamp * 1000);
            let tempName = date.getDate(date)+":"+date.getMonth(date)+":"+date.getFullYear(date);
            let temporary = new Forecast(tempName, icon, temperatureMax, temperatureMin);     // Definizione della classe Forecast sopra nel codice
            cityForecast.push(temporary);   // Inserisco questo forecast temporaneo nell'arrat cityForecast. Così ogni 8 "pezzi" (sono nel for), quindi 24 ore 
                                            // La response infatti ha una lista con 40 oggetti, uno ogni 3 ore. In un giorno ci sono quindi 8 oggetti.
            //console.log(temporary);
        }
        console.log(cityForecast);

        /* Inserimento dei dati nell'innerHTML dei div appartenenti alla classe "day" in index.html.
        Ogni elemento in cityForecast è un oggetto della classe Forecast, quindi ha 4 campo:
        date, icon, maxTemp e minTemp.*/
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

function viewItineraries(){
    var email = document.getElementById("loginEmail").value;
    console.log(email);

    fetch('../api/v1/users/' + email)   // Ricerca l'utente corrispondente a quella mail richiamando l'API di users
    .then((resp) => resp.json()) // Trasforma i dati in json
    .then(function(data) { // Qui inseriamo una funzione per modificare i dati a piacimento
        console.log(data);
        //loggedUser = data[0];
        loggedUser=data;    // Logged user contiene i dati ottenuti con la fetch e parsati in json
        loggedUser.id = loggedUser.self.substring(loggedUser.self.lastIndexOf('/') + 1);    // l'ID    // Viene aggiornato l'innerHTML dell'elemento "loggedUser" in index.html
        console.log("stampo id dell'itinerario");
        document.getElementById("idItiner").innerHTML = loggedUser.itinerary;
        return;
    })
    .catch( error => console.error(error) ); // Se c'è un qualsiasi errore viene catturato qui
}