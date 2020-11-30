const card = document.querySelectorAll('.card__inner');
var vero = true;
//var ritorno = true;
var cityForecast = [];

class Forecast{
    constructor(date, icon, maxTemp, minTemp){
        this.date=date;
        this.icon=icon;
        this.maxTemp=maxTemp;
        this.minTemp=minTemp;
    }
}

/*
card.classList.toggle('is-flipped');
*/

function searchForecast(){
    var search = $('#searchbar').val();
    console.log($('#searchbar').val());
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "./meteos/"+search,
        "method": "GET"
    }
    cityForecast=[];
    console.log(search);

    //è da aggiungere un await altrimenti il codice va avanti
    $.ajax(settings).done(function (response) {
        /*if(response.daily!=null&&response.daily!=undefined){
            console.log("non è nullo");
            ritorno=false;
            console.log(ritorno);
        }*/
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
        document.getElementById("cityName").innerHTML = search;
        
        document.getElementById("data_due").innerHTML = cityForecast[1].date;
        document.getElementById("imm_due").src = "http://openweathermap.org/img/w/"+cityForecast[1].icon+".png";
        document.getElementById("max_due").innerHTML = "Max: "+ cityForecast[1].maxTemp + "°";
        document.getElementById("min_due").innerHTML = "Min: "+ cityForecast[1].minTemp + "°";
        document.getElementById("cityName_due").innerHTML = search;

        document.getElementById("data_tre").innerHTML = cityForecast[2].date;
        document.getElementById("imm_tre").src = "http://openweathermap.org/img/w/"+cityForecast[2].icon+".png";
        document.getElementById("max_tre").innerHTML = "Max: "+ cityForecast[2].maxTemp + "°";
        document.getElementById("min_tre").innerHTML = "Min: "+ cityForecast[2].minTemp + "°";
        document.getElementById("cityName_tre").innerHTML = search;

        document.getElementById("data_quattro").innerHTML = cityForecast[3].date;
        document.getElementById("imm_quattro").src = "http://openweathermap.org/img/w/"+cityForecast[3].icon+".png";
        document.getElementById("max_quattro").innerHTML = "Max: "+ cityForecast[3].maxTemp + "°";
        document.getElementById("min_quattro").innerHTML = "Min: "+ cityForecast[3].minTemp + "°";
        document.getElementById("cityName_quattro").innerHTML = search;

        document.getElementById("data_cinque").innerHTML = cityForecast[4].date;
        document.getElementById("imm_cinque").src = "http://openweathermap.org/img/w/"+cityForecast[4].icon+".png";
        document.getElementById("max_cinque").innerHTML = "Max: "+ cityForecast[4].maxTemp + "°";
        document.getElementById("min_cinque").innerHTML = "Min: "+ cityForecast[4].minTemp + "°";
        document.getElementById("cityName_cinque").innerHTML = search;
    });

    /*console.log(ritorno);
    if(ritorno==false){
        console.log(card);
        for(i=0; i<card.length; i++){
            card[i].classList.toggle('is-flipped');
        }
    }*/

}