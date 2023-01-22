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
    fetch('https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${e9eea6bd1c1b037e4823474be2a7422a}')
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            var cityLon = response.coord.lon;
            var cityLat = response.coord.lat;

            fetch('https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${e9eea6bd1c1b037e4823474be2a7422a}')
                .then(function(response) {
                   return response.json();
                })
                .then(function(response){
                    userSearchHistoryList(cityName);

                    var currentWeatherSection = $('#current-container');
                    currentWeatherSection.addClass('current-container');

                    var currentTitle = $('#current-weather-title')
                    var currentDay = moment().format('M/D/YYYY');
                    currentTitle.text('${cityName} (${currentDay})');

                    

                })

             
        })
};

$('search-form').on('submit', function() {
    event.preventDefault();

    var cityName = $('#search-input').val()

    if (cityName === '' || cityName == null) {
        alert('Please enter name of city!');
        event.preventDefault();
    }else {
        currentWeatherSection(cityName);
        
    }
})

loadUserHistory();






