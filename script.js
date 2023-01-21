var APIKey = 'e9eea6bd1c1b037e4823474be2a7422a'; //My API key from OpenWeatherMap
var userSearhes = []; //Empty array for saved City Searches from user

var userSearchHistory = function(cityName) {
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
}





