function displayResults(responseJson) {
  $('.resultsList').empty();
  for (var i = 0; i < responseJson.results.length; i++) {
    var idStore = responseJson.results[i].id;
    const image = responseJson.results[i].imageUrls[0]
    $('.resultsList').append(
      `
      <li class="getRecLi"><img class="resultsimg" src ="https://spoonacular.com/recipeImages/${responseJson.results[i].image}"><button value = "${idStore}" class = "getRec">${responseJson.results[i].title}</button></li>
      `
    )
  }
  if (i == 0) {
     $('.resultsList').append(
      `
      <p class = "Error">Sorry, We Can't Find The Recipe You Are Looking For</p>
      `
    )
  }
  $('.getRec').click(function(){
      var getId = $(this).val();
      $('.resultsList').empty();
      $.ajaxSetup({
        headers : {
          "X-RapidAPI-Key" : "ab80ba08ebmsh519a2d68044569bp124b67jsn34df545f6c88"
        }
      });
      $.getJSON(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${getId}/information`, function(results) { 
        const backbutt = $('.backButton').val()
        $('.resultsList').append(
        
        `
          <h3>${results.title}</h3>
          <img class="recimg" src = "${results.image}">
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
          var getIngval = results.extendedIngredients[ithree].id;
          var getMes = results.extendedIngredients[ithree].measures.us.amount
          var getMesTwo = results.extendedIngredients[ithree].measures.us.unitShort
          var plusOne = ithree + 1;
          $('.resultsList').append(
            `
              <p class="plusOne">Ingredient ${plusOne}</p>
              <li class = "ing"><select class="ingSub ingSub-${ithree}" ><option class="ing-${ithree}">${getIng} ${getMes} ${getMesTwo}</select></li>
          `);
          getSubstituteIngredientData(ithree, getIngval);
        }
      });
    });
}

function getSubstituteIngredientData(elementId, id) {
    $.ajaxSetup({
      headers : {
        "X-RapidAPI-Key" : "ab80ba08ebmsh519a2d68044569bp124b67jsn34df545f6c88"
      }
    });
      $.getJSON(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/${id}/substitutes`, function(results) {
        console.log(results);
        appendSubstituteData(elementId, results);
    });
}

function appendSubstituteData(elementId, results) {
  if (results.status == 'failure') {
    //alert("Sorry this ingredient doesn't have a substitute")
    $(`.ingSub-${elementId}`).append(`<option>No substitutes</option>`);
  } else {
    //alert(JSON.stringify(results, element))
    for(var ifour = 0; ifour <results.substitutes.length; ifour++) {
      $(`.ingSub-${elementId}`).append(`<option value="${results.substitutes[ifour]}">${results.substitutes[ifour]}</option>`)
    }
  }
}

function handleIngredientClick() {
  $('.resultsList').on('click', '.getAlt', function(event) {
    var ingVal = $(this).val();
    console.log(ingVal);
    $.ajaxSetup({
      headers : {
        "X-RapidAPI-Key" : "ab80ba08ebmsh519a2d68044569bp124b67jsn34df545f6c88"
      }
    });
    $.getJSON(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/${ingVal}/substitutes`, function(results) {
      console.log(results);
      appendSubstituteData(results);
    });
  })
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
}

$('.backButton').click(function() {
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
  handleIngredientClick();
});