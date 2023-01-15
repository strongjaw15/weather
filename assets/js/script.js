// City, date, temp, wind, humidity

// These are other variables
let city;
let fiveDayWeather = [];
let unsortedWeather = []
let currentDateVal = ""

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

// This is the event listener for buttons.

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

$("#search-button").click(function(){
  city = searchInput.val()
  getCoordinates()
})

// This gets the coordinates for the searched city.
function getCoordinates(){
  geoCall = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  fetch(geoCall)
    .then(function(reply){
      return reply.json()
    })
    .then(function(easyData){
      console.log(easyData[0])
      
      lat = easyData[0].lat;
      lon = easyData[0].lon;
      console.log(lat)
      getWeather()
  })
}

function getWeather(){
  weatherCall = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  fetch(weatherCall)
    .then(function(reply){
      return reply.json()
    })
    .then(function(easyData2){
      unsortedWeather.push(easyData2)
      sortEasyData(easyData2)
    })
}

function sortEasyData(easyData3){
  easyData3.list.forEach(function(object){
    // use moment or dayjs to parse the obj dt variable and get the "real date"
    const dateObj = new moment(object.dt_txt)

    // from this dateObj, use moment or js to get the date it represents. ***This is for you to do ***.
    const currDay = dateObj.format("MM, DD, YYYY"); 
    console.log(currDay);

    // if the current dt value differs from the global variable, AND we don't have data in our array for this day, 
    // we must be on a new day
    if( currDay !== currentDateVal && fiveDayWeather.length < 5 && !fiveDayWeather.find( day => day.dt === object.dt ) ){
      currentDateVal = currDay // update the global variable so we don't use this day again

      // if JS is still in this function, then we must be encountering this dt object for the first time. So the obj variable used in the forEach() must be referring to the firt hour block for this day. get the first record (the obj variable above) and use that for the weather for this day
      fiveDayWeather.push(object)
    }
  })
console.log(fiveDayWeather)
}
