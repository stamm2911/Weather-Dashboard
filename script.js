var searchForm = $("#city-search");
var searchHist = $("#search-history");
var currentForecast = $("#current-forecast");
var cityName = $("#city-name");
var currentTemp = $("#current-temp");
var currentWind = $("#current-wind");
var currentHum = $("#current-hum");
var currentUvi = $("#current-uvi");
var foreCast = $("#5-day-forecast");
var historyStorage = [];
var searchHistLimit = 0;

searchForm.on("click", function (event) {
  event.preventDefault();
  var target = $(event.target);
  if (target.is("button") && searchForm.children().eq(0).val()) {
    getWeatherAPI(searchForm.children().eq(0).val().toLowerCase());
  }
});

searchHist.on("click", function (event) {
  var target = $(event.target);
  if (target.is("button")) {
    console.log(target.text());
    console.log(target.data());
    fetch(
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        target.data().lat +
        "&lon=" +
        target.data().lon +
        "&exclude=hourly,minutely&units=metric&dt=&appid=9eeae915352d9090af1c067593b3b1a7"
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setInfo(data);
      });
  }
});

function setNewBtn(lat, lon) {
  console.log(lat + " " + lon);
  if (searchHist.children().eq().prevObject.length < 10) {
    var index = searchHist.children().eq().prevObject.length;
    console.log(index);
    searchHist.append(
      "<button>" + searchForm.children().eq(0).val().toLowerCase() + "</button>"
    );
    searchHist
      .children()
      .eq()
      .prevObject.last()
      .attr("class", "btn btn-secondary rounded-3 w-100 mb-2");
    searchHist.children().eq().prevObject[index].setAttribute("data-index", index);
    searchHist.children().eq().prevObject.last().attr("data-lat", lat);
    searchHist.children().eq().prevObject.last().attr("data-lon", lon);
  } else {
    if (searchHistLimit > 9) {
      searchHistLimit = 0;
    }
    searchHist.children().eq().prevObject[
      searchHistLimit
    ].textContent = searchForm.children().eq(0).val();
    searchHist
      .children()
      .eq()
      .prevObject[searchHistLimit].setAttribute("data-index", searchHistLimit);
    searchHist
      .children()
      .eq()
      .prevObject[searchHistLimit].setAttribute("data-lat", lat);
    searchHist
      .children()
      .eq()
      .prevObject[searchHistLimit].setAttribute("data-lon", lon);
    console.log(
      searchHist.children().eq().prevObject[searchHistLimit].textContent
    );
    searchHistLimit++;
  }
  searchForm.children().eq(0).val("");
  historyStorage = [];
  for(var i = 0; i < searchHist.children().eq().prevObject.length; i++){
    var historyObject = {
      index:searchHist.children().eq().prevObject[i].dataset.index,
      city:searchHist.children().eq().prevObject[i].textContent,
      lat:searchHist.children().eq().prevObject[i].dataset.lat,
      lon:searchHist.children().eq().prevObject[i].dataset.lon,
    }
    historyStorage.push(historyObject);
  }
  console.log(historyStorage);
  console.log(JSON.stringify(historyStorage));
  localStorage.setItem('citySearchs',JSON.stringify(historyStorage));
}

function getWeatherAPI(city) {
  fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
      "&limit=1&appid=9eeae915352d9090af1c067593b3b1a7"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.length === 0 || data.cod == 404) {
        searchForm.children().eq(0).val("");
        alert("Enter a valid city");
      } else {
        console.log(data);
        console.log(data[0].lat);
        console.log(data[0].lon);
        fetch(
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
            data[0].lat +
            "&lon=" +
            data[0].lon +
            "&exclude=hourly,minutely&units=metric&dt=&appid=9eeae915352d9090af1c067593b3b1a7"
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            setInfo(data);
          });
        setNewBtn(data[0].lat, data[0].lon);
      }
    });
}

function setInfo(weatherAPI) {
  console.log(weatherAPI.daily);
  cityName.text(weatherAPI.timezone + " " + unixT2Date(weatherAPI.daily[0].dt));
  currentForecast
    .children()
    .eq(0)
    .children()
    .eq(1)
    .attr(
      "src",
      "http://openweathermap.org/img/w/" +
        weatherAPI.daily[0].weather[0].icon +
        ".png"
    );
  currentTemp.text(weatherAPI.daily[0].temp.eve + " C°");
  currentWind.text(weatherAPI.daily[0].wind_speed + " Km/h");
  currentHum.text(weatherAPI.daily[0].humidity + " %");
  currentUvi.text(weatherAPI.daily[0].uvi);
  if (weatherAPI.daily[0].uvi < 3) {
    currentForecast
      .children()
      .eq(4)
      .children()
      .eq(0)
      .attr("class", "ps-1 pe-1 rounded-3 bg-gradient bg-success");
  } else if (weatherAPI.daily[0].uvi < 8) {
    currentForecast
      .children()
      .eq(4)
      .children()
      .eq(0)
      .attr("class", "ps-1 pe-1 rounded-3 bg-gradient bg-warning");
  } else {
    currentForecast
      .children()
      .eq(4)
      .children()
      .eq(0)
      .attr("class", "ps-1 pe-1 rounded-3 bg-gradient bg-danger");
  }
  for (var i = 0; i < 5; i++) {
    foreCast
      .children()
      .eq(i)
      .children()
      .eq(0)
      .text(unixT2Date(weatherAPI.daily[i + 1].dt));
    foreCast
      .children()
      .eq(i)
      .children()
      .eq(1)
      .children()
      .eq(0)
      .children()
      .eq(0)
      .attr(
        "src",
        "http://openweathermap.org/img/w/" +
          weatherAPI.daily[i + 1].weather[0].icon +
          ".png"
      );
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
    // ------Recovered from: https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript-----
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
    // -------------------------------------------------------------------
    return formattedTime;
  }
}
