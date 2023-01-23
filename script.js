
var apiKey = "0af827efacf4924b7433953734648987"; // Used the following doc to get API Key https://coding-boot-camp.github.io/full-stack/apis/how-to-use-api-keys
var usersSearches = []; // This array is created so we can store the users search history

// This list will create the list of previous searched cities by the user
var userPrevSearches = function(city) {
    $('.past-search:contains("' + city + '")').remove();

    // User Entry
    var userEntry = $("<p>");
    userEntry.addClass("past-search");
    userEntry.text(city);

    // User Entry has somewhere to go (container)
    var userEntryContainer = $("<div>");
    userEntryContainer.addClass("past-city-container");

    // Add the user entry to the container
    userEntryContainer.append(userEntry);

    // Add the container of the user entry to the search entry container as a whole
    var userEntryContainerElement = $("#user-history-container");
    userEntryContainerElement.append(userEntryContainer);

    if (usersSearches.length > 0){
        // Updates the list as needed
        var previoususersSearches = localStorage.getItem("usersSearches");
        usersSearches = JSON.parse(previoususersSearches);
    }

    // This function saves the users searches to the array we set up as a global variable
    usersSearches.push(city);
    localStorage.setItem("usersSearches", JSON.stringify(usersSearches));

    // This will reset the search input after the button is submitted
    $("#search-input").val("");

};

// load saved search history entries into search history container
var userHistoryLoaded = function() {
    // get saved search history
    var userSearchHistorySaved = localStorage.getItem("usersSearches");

    // return false if there is no previous saved searches
    if (!userSearchHistorySaved) {
        return false;
    }

    // turn saved search history string into array
    userSearchHistorySaved = JSON.parse(userSearchHistorySaved);

    // go through userSearchHistorySaved array and make entry for each item in the list
    for (var i = 0; i < userSearchHistorySaved.length; i++) {
        userPrevSearches(userSearchHistorySaved[i]);
    }
};

var nowSection = function(city) {
    // Access API using API Key
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        // Receive data from API and parse them into objects
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            // Get the Long and Lat from the API 
            var cityLon = response.coord.lon;
            var cityLat = response.coord.lat;

            fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
                
                .then(function(response) {
                    return response.json();
                })
                // Apply the Data to the now section
                .then(function(response){
                    userPrevSearches(city);

                    // Create a container for the now-weather section
                    var nowContainer = $("#now-weather");
                    nowContainer.addClass("now-weather");

                    // Add the parsed info into the container, so that the reaader can view it
                    var nowTitle = $("#now-title");
                    var today = moment().format("M/D/YYYY");
                    nowTitle.text(`${city} (${today})`);
                    var nowIcon = $("#now-icon");
                    nowIcon.addClass("now-icon");
                    var nowIconCode = response.current.weather[0].icon;
                    nowIcon.attr("src", `http://openweathermap.org/img/wn/${nowIconCode}@2x.png`);

                    
                    var nowTemperature = $("#now-temp");
                    nowTemperature.text("Temperature: " + response.current.temp + " \u00B0F");

                    
                    var nowHumidity = $("#now-humid");
                    nowHumidity.text("Humidity: " + response.current.humidity + "%");

                    
                    var nowWindSpeed = $("#now-wS");
                    nowWindSpeed.text("Wind Speed: " + response.current.wind_speed + " MPH");

                    
                    var nowUVI = $("#now-uv");
                    nowUVI.text("UV Index: ");
                    var nowNumb = $("#current-number");
                    nowNumb.text(response.current.uvi);

                    // Add color, dependent on UVI 
                    if (response.current.uvi <= 2) {
                        nowNumb.addClass("best");
                    } else if (response.current.uvi >= 3 && response.current.uvi <= 7) {
                        nowNumb.addClass("better");
                    } else {
                        nowNumb.addClass("bad");
                    }
                })
        })
        .catch(function(err) {
            
            $("#search-input").val("");

            // Tell user that the city cannot be found.
            alert("We can't find that city, please try again!");
        });
};

var newForecast = function(city) {
    
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            
            var cityLon = response.coord.lon;
            var cityLat = response.coord.lat;

            fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
                
                .then(function(response) {
                    return response.json();
                })
                .then(function(response) {
                    console.log(response);

                    // Add future weather forecast title
                    var newWeatherTitle = $("#new-weather-title");
                    newWeatherTitle.text("5-Day Upcoming Forecast:")

                    
                    for (var i = 1; i <= 5; i++) {
                        // Create card for new containers
                        var newCard = $(".new-card");
                        newCard.addClass("new-card-details");

                        // Add the future date
                        var newDate = $("#new-date-" + i);
                        date = moment().add(i, "d").format("M/D/YYYY");
                        newDate.text(date);

                        // Add the icon, dependent on the weather
                        var newIcon = $("#future-icon-" + i);
                        newIcon.addClass("future-icon");
                        var newIconCode = response.daily[i].weather[0].icon;
                        newIcon.attr("src", `http://openweathermap.org/img/wn/${newIconeCode}@2x.png`);

                        // Add new temp
                        var newTemp = $("#new-temp-" + i);
                        newTemp.text("Temp: " + response.daily[i].temp.day + " \u00B0F");

                        // Add new humid
                        var newHumid = $("#new-humid-" + i);
                        newHumid.text("Humidity: " + response.daily[i].humidity + "%");
                    }
                })
        })
};

// Function will be called when the submit button is selected
$("#form").on("submit", function() {
    event.preventDefault();
    
    // Get the user's search input
    var city = $("#search-input").val();

    if (city === "" || city == null) {
        // If the card is empty, alert the user:
        alert("Enter the name of a U.S. City");
        event.preventDefault();
    } else {
        // If the input passes these checks, display the info for the user
        nowSection(city);
        newForecast(city);
    }
});

// This allows the user to use their search history
$("#user-history-container").on("click", "p", function() {
    
    var oldSearch = $(this).text();
    nowSection(oldSearch);
    newForecast(oldSearch);

    //
    var oldSearchClicked = $(this);
    oldSearchClicked.remove();
});

userHistoryLoaded();

console.log(localStorage)






