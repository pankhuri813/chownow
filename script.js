const startButton = document.getElementsByClassName('start-button')

function letsgo() {
    window.location.href = "./ChowNow.html"
}


const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

fetch('https://www.themealdb.com/api/json/v1/1/random.php')
  .then((response) => response.json())
  .then((data) => {
    // Get the name and image URL of the meal
    const name = data['meals'][0]['strMeal'];
    const imageUrl = data['meals'][0]['strMealThumb'];

    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
      if (data['meals'][0][`strIngredient${i}`]) {
        ingredients.push(data['meals'][0][`strIngredient${i}`]);
      }
    }
    console.log(ingredients);

    // Insert the data into the relevant elements on the page
    document.getElementById('meal-name').innerHTML = name;
    document.getElementById('meal-image').src = imageUrl;
  });

// get meal list that matches with the ingredients
function getMealList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Ingredients</a>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else{
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;
    });
}


// get ingrediant of the meal
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
}

// create a modal
function mealRecipeModal(meal){
    console.log(meal);
    meal = meal[0];
    let html =`
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">`
        for(let i=1; i<=20; i++){
            let ingredient = 'strIngredient' + i;
            if(meal[ingredient] != ""){
                html += `<p style="color: white;">${meal[ingredient]}</p>`
            }
        };
        html +=
        `</div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}



