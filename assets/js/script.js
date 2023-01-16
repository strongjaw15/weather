// City, date, temp, wind, humidity

// These are other variables
let city;
let fiveDayWeather = [];
let unsortedWeather = [];
let currentDateVal = "";
let saveData = [];
let newAr;

// These target the main forecast and five-day forecast divs.
const mainForecast = $(".main-forecast");
const fiveDay = $(".five-day-forecasts");

// This gets the search bar value.
let searchInput = $(".search");
const savedCity = $(".savedCity").val();
const aside = $(".aside");
const searchButton = $("#search-button")

// These are the lat and long variables.
let lat;
let lon;

// This is the API Key.
const apiKey = "5aa315b385603c7937d78408d3a4da4f"

// These are the API addresses.
let geoCall;
let weatherCall;

//I've left this old code for event listeners commented out so I can get help figuring out what is wrong with it after the weekend.

// $(".aside").addEventListener("click", function(event){
//   if(event.target.matches("button.search-button")){
//     console.log("hi");
//     getCoordinates(searchInput)
//   }
//   else if(event.target.matches("button.saved-city")){
//     getCoordinates(savedCity)
//   }
// })

// $(".aside").click(function(){
//   if($(this.matches("button#search-button"))){
//     console.log("hi")
//     // getCoordinates(searchInput)
//   }
//   else if($(this.matches("saved-city"))){
//     // getCoordinates(savedCity)
//   }
//   else {
//     return
//   }
// })

// This fills the saved cities card.
savedCitiesStart();

function savedCitiesStart(){
  // This gets the saveData from local storage, and keeps it from nullifying saveData if there's nothing there.
  newAr = JSON.parse(localStorage.getItem("saveData"))
  newAr ? saveData = newAr : saveData = []
  
  for(i=0;i<saveData.length;i++){
    $(".list-group").append(
      $("<button>").addClass("list-group-item place").text(`${saveData[i]}`).data("id", `${saveData[i]}`)
    )
  }
}

function newSavedCity(){
  newAr = JSON.parse(localStorage.getItem("saveData"));
  newAr ? saveData = newAr : saveData = [];
  $(".list-group").append(
    $("<button>").addClass("list-group-item place").text(`${saveData[saveData.length-1]}`).data("id", `${saveData[saveData.length-1]}`)
  )
}

// These are the event listeners for the buttons. 
$("#search-button").click(function(){
  city = searchInput.val();
  if(city.length < 1){return}
  else{
    saveCity()
    getCoordinates()};
})

$(".place").click(function(){
  city = $(this).data("id");
  getCoordinates();
  console.log("hi")
})

$(".clear-button").click(function(){
  localStorage.clear();
  saveData = [];
  city=""
  $(".list-group").detach();
})

// This gets the coordinates for the searched city.
function getCoordinates(){
  geoCall = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  fetch(geoCall)
    .then(function(reply){
      return reply.json()
    })
    .then(function(easyData){      
      lat = easyData[0].lat;
      lon = easyData[0].lon;
      city = easyData[0].name;
      getWeather()
  })
}

function getWeather(){
  weatherCall = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  fetch(weatherCall)
    .then(function(reply){
      return reply.json()
    })
    .then(function(easyData2){
      unsortedWeather.push(easyData2)
      sortEasyData(easyData2)
    });
}

// This is a modified version of the function Gary wrote. It creates a five day forecast out of the 40 or so three-hour forecasts returned by the API.
function sortEasyData(easyData3){
  fiveDayWeather = [];
  easyData3.list.forEach(function(object){
    // use moment or dayjs to parse the obj dt variable and get the "real date"
    const dateObj = new moment(object.dt_txt)

    // from this dateObj, use moment or js to get the date it represents. ***This is for you to do ***.
    const currDay = dateObj.format("MM, DD, YYYY"); 

    // if the current dt value differs from the global variable, AND we don't have data in our array for this day, 
    // we must be on a new day
    if( currDay !== currentDateVal && fiveDayWeather.length < 6 && !fiveDayWeather.find( day => day.dt === object.dt ) ){
      currentDateVal = currDay // update the global variable so we don't use this day again

      // if JS is still in this function, then we must be encountering this dt object for the first time. So the obj variable used in the forEach() must be referring to the firt hour block for this day. get the first record (the obj variable above) and use that for the weather for this day
      fiveDayWeather.push(object)
    }
  })
  writeForecast()
}

function writeForecast(){
  $(".weather-container").empty();

  // This populates the main forecast.
  $(".weather-container").append(
    $("<div>").addClass("main-forecast").append(
      $("<h2>").text(`${city}: ${moment(fiveDayWeather[0].dt_txt).format("MM/DD/YYYY")} - ${getIcon(fiveDayWeather[0].weather[0].icon)}`),
      $("<h6>").text(`Temperature: ${kelvinToFahrenheit(fiveDayWeather[0].main.temp)}\u00B0F`),
      $("<h6>").text(`Wind: ${Math.round(fiveDayWeather[0].wind.speed)} MPH`),
      $("<h6>").text(`Humidity: ${fiveDayWeather[0].main.humidity}%`)
    )
  )

  // This populates the five day forecast.
  $(".weather-container").append(
    $("<div>").addClass("five-day-forecasts").append(
      $("<h3>").text("Five-Day Forecast:"),
      $("<div>").addClass("forecast-cards")
    )
  )

  for(i=1;i<fiveDayWeather.length;i++){
    $(".forecast-cards").append(
      $("<div>").addClass("forecast-card").append(
        $("<h4>").text(`${moment(fiveDayWeather[i].dt_txt).format("MM/DD/YYYY")}`),
        $("<h5>").text(`${getIcon(fiveDayWeather[i].weather[0].icon)}`),
        $("<h6>").text(`Temp: ${kelvinToFahrenheit(fiveDayWeather[i].main.temp)}\u00B0F`),
        $("<h6>").text(`Wind: ${Math.round(fiveDayWeather[i].wind.speed)} MPH`),
        $("<h6>").text(`Humidity: ${fiveDayWeather[i].main.humidity}%`)  
      )
    )
  }
}

// This converts degrees Kelvin to degrees Fahrenheit.
function kelvinToFahrenheit(kelvin){
  let fahrenheit = [[kelvin - 273.15] * 9 / 5] + 32;
  return Math.round(fahrenheit)
}

// This gets the little weather icons.
function getIcon(icon){
  var iconCode = (icon === "01d" || icon === "01n") ? "\u2600":
    (icon === "02d" || icon === "02n") ? "\uD83C\uDF24":
    (icon === "03d" || icon === "03n" || icon === "04d" || icon === "04n") ? "\u2601":
    (icon === "09d" || icon === "09n" || icon === "10d" || icon === "10n") ? "\u2601":
    (icon === "11d" || icon === "11n") ? "\uD83C\uDF29":
    (icon === "13d" || icon === "13n") ? "\uD83C\uDF28" : "\u26C6";
    return iconCode
}

// This saves the city search, but not a duplicate.
function saveCity(){
  let newArray = [city];
  saveData = [...new Set([...saveData, ...newArray])];
  localStorage.setItem("saveData", JSON.stringify(saveData));
  newSavedCity();
}