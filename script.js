var APIKey = 'e9eea6bd1c1b037e4823474be2a7422a'; //My API key from OpenWeatherMap
var userSearches = []; //Empty array for saved City Searches from user

var userSearchHistoryList = function(cityName) {
    $('.past-search:contains("' + cityName + '")').remove();

    var searchHistoryEntry = $("<p>");
    searchHistoryEntry.addClass("past-search");
    searchHistoryEntry.text(cityName);

    var searchEntryContainer = $("<div>");
    searchEntryContainer.addClass("past-search-container");

    searchEntryContainer.append(searchHistoryEntry);

    var searchHistoryContianerEl = $("user-search-hist-container");
    searchHistoryContianerEl.append(searchHistoryEntry);

    if (userSearhes.length > 0){
        var prevSavedSearches = localStorage.getItem('savedSearches');
        savedSearches = JSON.parse(prevSavedSearches);
    }

    savedSearches.push(cityName);
    localStorage.setItem("userSearches", JSON.stringify(userSearches));

    $("user-search-input").val("");
};


var loadUserHistory = function() {
    var userSearchHistory = localStorage.getItem(userSearches);

    if (!userSearchHistory) {
        return false;
    }

    userSearchHistory = JSON.parse(userSearchHistory);

    for (var i = 0; i < userSearchHistory.length; i++) {
        userSearchHistoryList(userSearchHistory[i]);
    }
};

var currentWeatherSection = function(cityName) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}')
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            var cityLon = response.coord.lon;
            var cityLat = response.coord.lat;

            fetch('https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}')
                .then(function(response) {
                   return response.json();
                })
                .then(function(response){
                    console.log(response);

                    var futureWeatherTitle = $("#future-weather-title");
                    futureWeatherTitle.text("5-Day Forecast");

                    for (var i=1; i <= 5; i++) {
                        var futureCard = $('.future-weather-card');
                        futureCard.addClass("future-card-details");

                        var futureDate = $("#new-date-" + i);
                        date = moment().add(i, "d").format("M/D/YYYY");
                        futureDate.text(date);

                        var futureTemp = $('#new-temp-' + i);
                        futureTemp.text("Temp:" + response.daily[i].temp.day + " \u00B0F");

                        var futureHumidity = $("#new-humid-" + i);
                        futureHumidity.text("Humidity: " + response.daily[i].humidity + "%")
                    }
                })

             
        })
}


 console.log(currentWeatherSection)






