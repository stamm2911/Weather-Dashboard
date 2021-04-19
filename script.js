// var requestUrl =
// "https://api.openweathermap.org/data/2.5/onecall?lat=19.432608&lon=-99.133209&exclude=hourly,minutely&units=metric&dt=&appid=9eeae915352d9090af1c067593b3b1a7";
var requestUrl =
  "https://api.openweathermap.org/data/2.5/onecall?lat=47.36667&lon=8.55&exclude=hourly,minutely&units=metric&dt=&appid=9eeae915352d9090af1c067593b3b1a7";
var currentForecast = $('#current-forecast');
var cityName = $("#city-name");
var currentTemp = $("#current-temp");
var currentWind = $("#current-wind");
var currentHum = $("#current-hum");
var currentUvi = $("#current-uvi");
var foreCast = $("#5-day-forecast");
// var weatherAPI;
// http://openweathermap.org/img/w/04d.png
fetch(requestUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    setInfo(data);
  });

function setInfo(weatherAPI) {
  console.log(foreCast
  .children()
  .eq(0)
  .children()
  .eq(1)
  .children()
  .eq(0)
  .children()
  .eq(0));
  console.log(weatherAPI.daily);
  console.log(foreCast.children().eq(0).children().eq(0).text("puyo"));
  cityName.text(weatherAPI.timezone + " " + unixT2Date(weatherAPI.daily[0].dt));
  currentForecast.children().eq(0).children().eq(1).attr('src','http://openweathermap.org/img/w/' + weatherAPI.daily[0].weather[0].icon + '.png');
  currentTemp.text(weatherAPI.daily[0].temp.eve + " C°");
  currentWind.text(weatherAPI.daily[0].wind_speed + " Km/h");
  currentHum.text(weatherAPI.daily[0].humidity + " %");
  currentUvi.text(weatherAPI.daily[0].uvi);

  for (var i = 0; i < 5; i++) {
    foreCast
      .children()
      .eq(i)
      .children()
      .eq(0)
      .text(unixT2Date(weatherAPI.daily[i+1].dt));
    
    foreCast
      .children()
      .eq(i)
      .children()
      .eq(1)
      .children()
      .eq(0)
      .children()
      .eq(0).attr('src','http://openweathermap.org/img/w/' + weatherAPI.daily[i+1].weather[0].icon + '.png')

    foreCast
      .children()
      .eq(i)
      .children()
      .eq(1)
      .children()
      .eq(1)
      .children()
      .eq(0)
      .text(weatherAPI.daily[i + 1].temp.eve + " C°");
    foreCast
      .children()
      .eq(i)
      .children()
      .eq(1)
      .children()
      .eq(2)
      .children()
      .eq(0)
      .text(weatherAPI.daily[i + 1].wind_speed + " Km/h");
    foreCast
      .children()
      .eq(i)
      .children()
      .eq(1)
      .children()
      .eq(3)
      .children()
      .eq(0)
      .text(weatherAPI.daily[i + 1].humidity + " %");
  }

  function unixT2Date(dateNow) {
    // ------https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript-----
    // let unix_timestamp = 1618830000;
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(dateNow * 1000);
    // Hours part from the timestamp
    var hours = date.getDate();
    // Minutes part from the timestamp
    var minutes = +date.getMonth() + 1;
    // Seconds part from the timestamp
    var seconds = date.getFullYear();

    // Will display time in 10:30:23 format
    var formattedTime = hours + "/" + minutes + "/" + seconds;
    return formattedTime;
  }
}
