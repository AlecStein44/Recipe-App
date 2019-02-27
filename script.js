function displayResults(responseJson) {
  $('.resultsList').empty();
  for (var i = 0; i < responseJson.results.length; i++) {
    var idStore = responseJson.results[i].id;
    $('.resultsList').append(
      `
      <li class="getRecLi"><button value = "${idStore}" class = "getRec">${responseJson.results[i].title}</button></li>
      `
    )
  }
  $('.getRec').click(function(){
      var getId = $('.getRec').val();
      $('.resultsList').empty();
      $.ajaxSetup({
        headers : {
          "X-RapidAPI-Key" : "ab80ba08ebmsh519a2d68044569bp124b67jsn34df545f6c88"
        }
      });
      $.getJSON(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${getId}/information`, function(results) { 
        $('.resultsList').append(
        
        `
          <h3>${results.title}</h3>
          <img src = "${results.image}">
       `
        )
        for(var itwo = 0; itwo < results.analyzedInstructions[0].steps.length; itwo++) {
          var getSteps = results.analyzedInstructions[0].steps[itwo].step;
          $('.resultsList').append(
        
        `
          <li class = "stepsjs">${itwo + 1}. ${getSteps}</li>
       `
        )
        }

        for(var ithree = 0; ithree < results.extendedIngredients.length;ithree++ ) {
          var getIng = results.extendedIngredients[ithree].name;
          var getMes = results.extendedIngredients[ithree].measures.us.amount
          var getMesTwo = results.extendedIngredients[ithree].measures.us.unitShort
          var plusOne = ithree + 1;
          $('.resultsList').append(
        `
          <p class="plusOne">Ingredient ${plusOne}</p>
          <li class = "ing">${getIng} ${getMes} ${getMesTwo}</li>
       `
        )
        }
      });
    });
}
function getRecipe(foodName, numCount) {
      fetch(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?number=${numCount}&offset=0&type=main+course&query=${foodName}`,  {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
              "X-RapidAPI-Key": "ab80ba08ebmsh519a2d68044569bp124b67jsn34df545f6c88",
          },
          redirect: "follow",
          referrer: "no-referrer",
          body: JSON.stringify(),
      })
      .then(response => response.json())
      .then(responseJson => displayResults(responseJson))
      .then(responseJson => loopId(responseJson))
}

$('.submitButton').click(function(){
  getRecipe();
  displayresults(); 
});

function watchForm() {
  $('form').submit(function(event) {
    event.preventDefault();

    const foodName = $(this).find('.searchBar').val();
    const numCount = $(this).find('.numberCount').val();
    getRecipe(foodName, numCount);
  });
}

$(function() {
  console.log('All loaded!');
  watchForm();
});