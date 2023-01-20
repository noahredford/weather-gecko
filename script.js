var searchFormEl = document.querySelector('#search-form');
var APIKey = 'e9eea6bd1c1b037e4823474be2a7422a';
var tempItem = document.querySelector('#header')
var searchBtn = document.querySelector('search-btn')



function handleSearchFormSubmit(event) {
  event.preventDefault();

  var citySelection = document.querySelector('#search-input').value;



  var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + citySelection + "&appid=" + APIKey;

  fetch(queryURL)

  location.assign(queryURL);
}

function getTemp() {
    var reqUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + citySelection + "&appid=" + APIKey  + '&temp';

    fetch(reqUrl)
        .then (function(response){
            return response.json()
        })
}



searchFormEl.addEventListener('submit', handleSearchFormSubmit, getTemp);

