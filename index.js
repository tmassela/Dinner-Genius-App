'use strict';

// put your own value below!
const searchURL ='https://api.edamam.com/search';

function formatQueryParams(params) {
  const queryItems = 
   "?q=" + params.q + 
   "&app_id=" + params.app_id + 
   "&app_key=" + params.app_key + 
   "&calories=" + params.calories;
  
  return queryItems;
  console.log(queryItems);
};

function displayResults(responseJson) {
  
  // if there are previous results, remove them
  $('.card').empty();
  
  // iterate through the items array and append results to display
  for (let i = 0; i < 10; i++)  {

    const cal = Math.round(( responseJson.hits[i].recipe.calories )/ (responseJson.hits[i].recipe.yield))
    
    $(".card").append(
      `<div class="card--content">
      <h1><a href="${responseJson.hits[i].recipe.url}" target="_blank">${responseJson.hits[i].recipe.label}</a></h1>
      <img src="${responseJson.hits[i].recipe.image}" alt="${responseJson.hits[i].recipe.label} image">
      <p>Serves ${responseJson.hits[i].recipe.yield}</p><br>
      <p>Calories per Serving: ${cal} </p><br>
      </div>`
    )}
  
  //display the results section  
  $('#results').removeClass('hidden');
};

function displayWineResults(responseJson) {

    $('.wine').empty();

    if (responseJson.pairedWines === undefined || responseJson.pairedWines.length == 0 ){
        
        $('.wine').append(
       `<p>Merlot is always a good choice!</p>`)
       
       } else {
  
        $('.wine').append(
        `<p>Pairs well with: ${responseJson.pairedWines[0]} or ${responseJson.pairedWines[1]}</p><br>
        <p>${responseJson.pairingText}</p>`
        )}
};



function getRecipes(ingredient1, ingredient2, minCal, maxCal) {
  
  const params = {
    q: ingredient1 + "," + ingredient2,
    calories:  minCal + "-" + maxCal,
    app_id: "1c394cbb",
    app_key: "ac7db2992d579f7cb37de04d937df51b",
  }

  const queryString = formatQueryParams(params);
  const url = searchURL + queryString;
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Bummer... we don't see that ingredient, please try again.`);
    })
};

function getWinePair(ingredient1) {
    
    const searchURLWine = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/wine/pairing?food=";

    const queryStringWine = ingredient1;
    const urlWine = searchURLWine + queryStringWine;


  const options = {
    headers: new Headers(
      
      {
      "X-RapidAPI-Key": "e342020307mshde9394c0fceb28ap1bb36cjsn036e1478796e",
       "X-RapidAPI-Host" : "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
      })
  }
    
    console.log(urlWine);

    fetch(urlWine, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayWineResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Bummer... we don't have a wine suggestion.`);
    });
};



function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    
    const ingredient1 = $('#ingredient1').val();
    const ingredient2 = $('#ingredient2').val();
    const minCal = $('#minCal').val();
    const maxCal = $('#maxCal').val();
    
    getRecipes(ingredient1, ingredient2, minCal, maxCal);
    getWinePair(ingredient1);
  });
}

$(watchForm);