const searchInput = document.querySelectorAll(".search-bar input");
const menuOptions = document.querySelectorAll(".menu-link");
const image = document.querySelectorAll(".dish");
const recommendedDishes = document.querySelectorAll(".dish");
const bestRecipeSection = document.querySelector(".best-recipie-section");
const uploadRecipeBtn = document.querySelector(".upload-btn");
//-------create Elements-----------------
const modal = document.createElement("div");
const SearchResultsDiv = document.createElement("div");
const imageSliderNext = document.querySelector(".next");
const imageSliderPrev = document.querySelector(".previous");

//---------------Pages----------------------
const homePage = document.getElementById("home-page");
const searchPage = document.getElementById("search-results");
const bookmarkPage = document.getElementById("bookmark-section");
const addRecipePage = document.getElementById("add-recipe-section");

//------------------------constant variables-------------
const API_URL = "https://forkify-api.herokuapp.com/api/v2/recipes";
const KEY = `191712e4-494d-4c6c-bbd9-ce82ee7a85cd`;

const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
  },
  bookmarks: [],
};

const dishesArray = [
  "5ed6604591c37cdc054bcd09",
  "5ed6604691c37cdc054bd0f9",
  "5ed6604591c37cdc054bcb1b",
  "5ed6604591c37cdc054bcc80",
  "5ed6604591c37cdc054bcd83",
  "5ed6604591c37cdc054bc98c",
  "5ed6604691c37cdc054bd0e0",
  "5ed6604591c37cdc054bcdf9",
  "5ed6604591c37cdc054bcc0a",
  "5ed6604591c37cdc054bc98b",
  "5ed6604591c37cdc054bce57",
  "5ed6604591c37cdc054bcd5a",
  "5ed6604591c37cdc054bca38",
  "5ed6604691c37cdc054bd04d",
  "5ed6604591c37cdc054bc863",
  "5ed6604591c37cdc054bcc61",
  "5ed6604691c37cdc054bd042",
  "5ed6604591c37cdc054bcf55",
  "5ed6604591c37cdc054bca36",
  "5ed6604691c37cdc054bd044",
  "5ed6604591c37cdc054bcabc",
  "5ed6604691c37cdc054bd0ca",
  "5ed6604591c37cdc054bcc40",
  "5ed6604591c37cdc054bcef3",
  "5ed6604691c37cdc054bd00c",
  "5ed6604591c37cdc054bcb7b",
  "5ed6604591c37cdc054bcd09",
  "5ed6604591c37cdc054bcccc",
  "5ed6604591c37cdc054bceff",
  "5ed6604691c37cdc054bcfd3",
  "5ed6604591c37cdc054bcb27",
  "5ed6604591c37cdc054bcc51",
  "5ed6604591c37cdc054bcf51",
  "5ed6604591c37cdc054bcc38",
  "5ed6604591c37cdc054bcb67",
  "5ed6604591c37cdc054bc9d3",
  "5ed6604591c37cdc054bca9f",
  "5ed6604591c37cdc054bcebc",
  "5ed6604591c37cdc054bcbe1",
  "5ed6604691c37cdc054bd0f2",
  "5ed6604591c37cdc054bccc7",
  "5ed6604591c37cdc054bcdeb",
  "5ed6604691c37cdc054bd004",
  "5ed6604591c37cdc054bcc6d",
  "5ed6604591c37cdc054bcab8",
  "5ed6604591c37cdc054bcc56",
  "5ed6604591c37cdc054bcf9a",
  "5ed6604591c37cdc054bcfa7",
  "5ed6604591c37cdc054bc976",
];

const colorArray = [
  "#D3ECA7",
  "#DAD992",
  "#A1B57D",
  "#DEBA9D",
  "#A1B57D",
  "#ddaca7",
  "#b5adba",
  "#C0D8C0",
  "#E6D0A7",
  "#FFE6BC",
];

//-----------------------------functions--------------------------------
//---------------Daily best recipies section------------------
const loadRecipesByid = async function (id) {
  try {
    const res = await fetch(`${API_URL}/${id}?key=${KEY}`);
    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
};

const displayDailyBestRecipies = async function () {
  renderLoader(bestRecipeSection);
  let recipe = [];
  for (let a = 0; a < 9; a++) {
    let randomNumber = dishesArray[Math.floor(Math.random() * 49)];
    recipe.push(await loadRecipesByid(randomNumber));
  }
  removeLoader();
  for (let i = 0; i < 9; i++) {
    bestRecipeSection.innerHTML += `<div class="best-recipe-card" id="${
      recipe[i].data.recipe.id
    }" style="background-color:${colorArray[Math.floor(Math.random() * 10)]}">
    <img src="${
      recipe[i].data.recipe.image_url
    }" style="min-width:100px" alt="" />
    <div class="recipe_info">${
      recipe[i].data.recipe.title.length > 20
        ? recipe[i].data.recipe.title.slice(0, 20) + "..."
        : recipe[i].data.recipe.title
    }</div>
    </div>`;
  }
  document.querySelectorAll(".best-recipe-card").forEach((c) =>
    c.addEventListener("click", function () {
      loadRecipes(c.id);
    })
  );
};

//---------------Search Results functionality--------------------
const loadSearchResults = async function (query) {
  SearchResultsDiv.innerHTML = "";
  modal.innerHTML = "";
  try {
    window.location.hash = `#search-${query}`;
    state.search.query = query;
    renderLoader(searchPage);
    const res = await fetch(`${API_URL}?search=${query}&key=${KEY}`);
    const data = await res.json();
    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
    setTimeout(function () {
      removeLoader();
      showSearchResults(state);
    }, 2000);
  } catch (err) {
    throw err;
  }
};

const showSearchResults = async function (data) {
  SearchResultsDiv.className = "search-results-container";
  SearchResultsDiv.innerHTML = `<h1 style="text-transform:capitalize; width:100%; margin:0px 0 -10px 15px; font-weight: 500;">${data.search.query} Recipes</h1>`;
  searchPage.append(SearchResultsDiv);
  for (let i = 0; i < data.search.results.length; i++) {
    const searchhtml = `<div class="search-recipe-card" id="${
      data.search.results[i].id
    }" style="background-color:${colorArray[Math.floor(Math.random() * 10)]}">
        <img src="${data.search.results[i].image}" alt="" />
        <div class="recipe_info">${data.search.results[i].title}</div>
      </div>`;
    SearchResultsDiv.insertAdjacentHTML("beforeend", searchhtml);
  }
  document.querySelectorAll(".search-recipe-card").forEach((i) =>
    i.addEventListener("click", function () {
      loadRecipes(i.id);
    })
  );
};

//----------------display recipe functionality---------------
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    rating: Math.floor(Math.random() * 4) + 2,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

const loadRecipes = async function (id) {
  try {
    const res = await fetch(`${API_URL}/${id}?key=${KEY}`);
    const data = await res.json();
    state.recipe = createRecipeObject(data);
    createRecipieModal(state.recipe);
  } catch (err) {
    throw err;
  }
};
const createRecipieModal = function (data, preloaction) {
  window.location.hash = `#${data.id}`;
  modal.style.position = "absolute";
  modal.style.zIndex = "100";
  modal.className = "recipe-modal";
  modal.innerHTML = `
  <div class="food-img"><img src="${data.image}" alt="">
  <button class="back-btn"><i class="fas fa-arrow-left"></i> Back</button></div>
  <div class="food-info">
    <h1 class="food-title">${data.title}</h1>
    <div class="ratings-and-bookmark">
      <div class="ratings">${randomRatingsGeenerator()}</div>
      <div class="bookmark ${
        data.bookmarked ? "bookmarked" : ""
      }"><i class="fas fa-bookmark"></i></div>
    </div>
    <div class="time_serving_info">
      <div class="cooking_time">
        <i class="far fa-clock"></i>
        ${data.cookingTime} mins
      </div>
      <div class="serving_info">
        <i class="fas fa-user-friends" style="margin-top: 3px;"></i>
        <div class="serving_count">${data.servings}</div>
        <div class="increment"><i class="fas fa-plus-circle"></i></div>
        <div class="decrement"><i class="fas fa-minus-circle"></i></div>
      </div>
    </div>
    <div class="recipe_ingredients">
    <h2>Recipe Ingredients</h2>
      <ul class="recipe__ingredient-list">
        ${data.ingredients.map((i) => generateMarkupIngredient(i)).join("")}
        </ul>
    </div>
    <div class="methodology">
      <h3>How to Cook It</h3>
      <p>
        This recipe was carefully designed and tested by <span style="font-weight:700">${
          data.publisher
        }</span>.
        Please check out directions at their website
      </p>
    </div>
    <a href="${
      data.sourceUrl
    }">Directions <i class="fas fa-arrow-right"></i></a>
  </div>`;
  document.querySelector("body").append(modal);
  toggleBookmark(data);
  modal.querySelector(".back-btn").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.hash = `${
      preloaction
        ? preloaction
        : state.search.query
        ? `#search-${state.search.query}`
        : "#home-page"
    }`;
  });
  modal.querySelector(".increment").addEventListener("click", function (e) {
    updateIngredients(++e.currentTarget.previousElementSibling.innerHTML);
  });
  modal.querySelector(".decrement").addEventListener("click", function (e) {
    if (
      e.currentTarget.previousElementSibling.previousElementSibling.innerHTML >
      1
    ) {
      updateIngredients(
        --e.currentTarget.previousElementSibling.previousElementSibling
          .innerHTML
      );
    }
  });
};
function randomRatingsGeenerator() {
  let remaining = 5 - state.recipe.rating;
  let output = "";
  for (let i = 0; i < state.recipe.rating - 1; i++)
    output += `<i class="fas fa-star"></i>`;
  output += `<i class="fas fa-star-half-alt"></i>`;
  for (let i = 0; i < remaining; i++) output += `<i class="far fa-star"></i>`;
  return output;
}

function updateIngredients(newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
  modal.querySelector(
    ".recipe__ingredient-list"
  ).innerHTML = `${state.recipe.ingredients
    .map((i) => generateMarkupIngredient(i))
    .join("")}`;
}

function generateMarkupIngredient(ing) {
  return `<li>
    <div class="recipe__quantity" style="${calculateMargin(ing.quantity)}">
    <i class="far fa-hand-point-right"></i>
    ${ing.quantity ? toFraction(ing.quantity) : ""}</div>
    <div class="recipe__description">
      <span class="recipe__unit">${ing.unit}</span>
      ${ing.description}
    </div>
  </li>`;
}

function calculateMargin(ing) {
  return ing ? "margin-right:0.5rem" : "margin-right:0";
}

var toFraction = function (dec) {
  var is_neg = dec < 0;
  dec = Math.abs(dec);
  var done = false;
  var n1 = 0,
    d1 = 1,
    n2 = 1,
    d2 = 0,
    n = 0,
    q = dec,
    epsilon = 1e-13;
  while (!done) {
    n++;
    if (n > 10000) {
      done = true;
    }
    var a = parseInt(q);
    var num = n1 + a * n2;
    var den = d1 + a * d2;
    var e = q - a;
    if (e < epsilon) {
      done = true;
    }
    q = 1 / e;
    n1 = n2;
    d1 = d2;
    n2 = num;
    d2 = den;
    if (Math.abs(num / den - dec) < epsilon || n > 30) {
      done = true;
    }
  }
  let numerator = parseInt(is_neg ? -num : num);
  let denominator = parseInt(`${den}`);
  let fra = Math.floor(numerator / denominator);
  let ans =
    numerator % denominator == 0
      ? numerator / denominator
      : numerator > denominator
      ? `${fra} ${numerator - fra * denominator}/${denominator}`
      : `${numerator}/${denominator}`;

  return ans;
};

//---------------------Bookmarks functionality------------------------

const createBookmarkSection = function (data) {
  document.querySelector(
    ".bookmark-card-container"
  ).innerHTML += `<div class="bookmark-card" id="${data.id}">
  <div class="bookmark-img">
    <img src="${data.image}" alt="" />
  </div>
  <p class="bookmark-title">${
    data.title.length > 30 ? data.title.slice(0, 30) + "..." : data.title
  }</p>
  <div class="bookmark-rating">
    <div class="ratings" style="gap: 0.2rem">
    ${randomRatingsGeenerator()}
    </div>
    <div class="bookmark bookmarked">
      <i
        class="fas fa-bookmark"
        style="font-size: 12px; margin-top: -5px"
      ></i>
    </div>
  </div>
</div>`;
  deleteAndDisplayBookmarkCard();
};

const deleteAndDisplayBookmarkCard = function () {
  //-----delete bookmark card--------------------
  document
    .querySelector(".bookmark-card-container")
    .querySelectorAll(".bookmark")
    .forEach((card) =>
      card.addEventListener("click", function (e) {
        e.currentTarget.parentElement.parentElement.remove();
        removeBookmark(e.currentTarget.parentElement.parentElement.id);
      })
    );
  //------------------display bookmark card recipe----------
  document.querySelectorAll(".bookmark-img").forEach((i) =>
    i.addEventListener("click", function () {
      let [recipe] = state.bookmarks.filter(
        (el) => el.id == i.parentElement.id
      );
      createRecipieModal(recipe, "#bookmark-section");
    })
  );
};

const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  createBookmarkSection(recipe);
};

const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
};

const toggleBookmark = function (data) {
  const bookmarkIcon = modal.querySelector(".bookmark");
  bookmarkIcon.addEventListener("click", function () {
    if (data.bookmarked) {
      bookmarkIcon.classList.remove("bookmarked");
      document.querySelector(".bookmark-card").remove();
      removeBookmark(data.id);
    } else {
      bookmarkIcon.classList.add("bookmarked");
      addBookmark(data);
    }
  });
};

//---------------Add recipie functionality--------------------
// const newRecipe = {};
// const readNewRecipe = function () {
//   document.querySelectorAll(".form-group input").forEach((i) =>
//     i.addEventListener("keyup", function (e) {
//       if (e.keyCode == "13") {
//         if (e.currentTarget.previousElementSibling.innerHTML == "Title")
//           newRecipe.title = i.value;
//         else if (e.currentTarget.previousElementSibling.innerHTML == "URL")
//           newRecipe.sourceUrl = i.value;
//         else if (
//           e.currentTarget.previousElementSibling.innerHTML == "Image URL"
//         )
//           newRecipe.image = i.value;
//         else if (
//           e.currentTarget.previousElementSibling.innerHTML == "Publisher"
//         )
//           newRecipe.publisher = i.value;
//         else if (
//           e.currentTarget.previousElementSibling.innerHTML == "Prep time"
//         )
//           newRecipe.cookingTime = i.value;
//         else if (e.currentTarget.previousElementSibling.innerHTML == "servings")
//           newRecipe.servings = i.value;
//         else if (
//           e.currentTarget.previousElementSibling.textContent.slice(0, 10) ==
//           "Ingredient"
//         ) {
//           e.preventDefault();
//           newRecipe.ingredients.push(i.value);
//           console.log(newRecipe.ingredients);
//         }
//       }
//     })
//   );
// };
function createAddRecipeObject() {
  document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    const dataArr = [...new FormData(this)];
    const newRecipe = Object.fromEntries(dataArr);
    uploadRecipe(newRecipe);
  });
}
createAddRecipeObject();

const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient"))
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient fromat! Please use the correct format :)"
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const response = await fetch(`${API_URL}?key=${KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipe),
    });
    const data = await response.json();
    if (data.status == "fail") alert(data.message);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    uploadRecipeBtn.innerHTML = `Uploaded`;
    setTimeout(function () {
      window.location.hash = "#bookmark-section";
      document.querySelector("form").reset();
    }, 2000);
  } catch (err) {
    alert(err);
    throw err;
  }
};

//-----------function for redirecting page using menu options--------
const redirectPage = function (link) {
  if (link.textContent.trim() == "Home") {
    window.location.hash = "#home-page";
  } else if (link.textContent.trim() == "Browse") {
    window.location.hash = `#search-${
      state.search.query ? state.search.query : "burger"
    }`;
    if ((window.location.hash = "#search-burger")) {
      loadSearchResults("burger");
    }
  } else if (link.textContent.trim() == "Bookmarks") {
    window.location.hash = "#bookmark-section";
    console.log(bookmarkPage.children[1].children.length);
  } else if (link.textContent.trim() == "Add recipe") {
    window.location.hash = "#add-recipe-section";
  }
};

//----------------------image slider function------------------------
function showNextItem() {
  if (count < itemCount - 1) {
    for (let i = count; i < count + 5; i++) {
      image[i].classList.remove("active");
    }
    count += 5;
    if (count == 5) {
      imageSliderNext.style.display = "none";
      imageSliderPrev.style.display = "block";
    }
  }
  for (let i = count; i < count + 6; i++) {
    image[i].classList.add("active");
  }
}
function showPreviousItem() {
  if (count >= 0) {
    for (let i = count; i < count + 5; i++) {
      image[i].classList.remove("active");
    }
    count -= 5;
    if (count == 0) {
      imageSliderPrev.style.display = "none";
      imageSliderNext.style.display = "block";
    }
  }
  for (let i = count; i < count + 5; i++) {
    image[i].classList.add("active");
  }
}

//---------------Loader------------------------
function renderLoader(parentEl) {
  const markup = `
  <div class="loader">
  </div>
`;
  parentEl.style.position = "relative";
  parentEl.insertAdjacentHTML("afterbegin", markup);
}

function removeLoader() {
  document.querySelector(".loader").remove();
}

//-----------------window eventlistener----------------------------

window.location.hash = "#home-page";
window.addEventListener("hashchange", function () {
  document.querySelector(".card-container").style.display = "flex";
  if (window.location.hash == "#home-page") {
    homePage.style.display = "block";
    homePage.scrollTop = "0";
    searchPage.style.display = "none";
    bookmarkPage.style.display = "none";
    addRecipePage.style.display = "none";
    if (document.querySelector(".recipe-modal")) {
      document.querySelector(".recipe-modal").style.display = "none";
    }
  } else if (
    window.location.hash == "#search-results" ||
    window.location.hash.substring(0, 8) == "#search-"
  ) {
    homePage.style.display = "none";
    searchPage.style.display = "block";
    searchPage.scrollTop = "0";
    bookmarkPage.style.display = "none";
    addRecipePage.style.display = "none";
    if (document.querySelector(".recipe-modal")) {
      document.querySelector(".recipe-modal").style.display = "none";
    }
  } else if (window.location.hash == "#bookmark-section") {
    homePage.style.display = "none";
    searchPage.style.display = "none";
    bookmarkPage.style.display = "block";
    addRecipePage.style.display = "none";
    if (bookmarkPage.children[1].children.length < 1) {
      bookmarkPage.children[1].innerHTML = `<div class="err-msg">Oops!! No bookmarks saved for now..</div>`;
    } else {
      bookmarkPage.querySelector(".err-msg") &&
        bookmarkPage.querySelector(".err-msg").remove();
    }
    if (document.querySelector(".recipe-modal")) {
      document.querySelector(".recipe-modal").style.display = "none";
    }
  } else if (window.location.hash == "#add-recipe-section") {
    homePage.style.display = "none";
    searchPage.style.display = "none";
    bookmarkPage.style.display = "none";
    addRecipePage.style.display = "block";
    if (document.querySelector(".recipe-modal")) {
      document.querySelector(".recipe-modal").style.display = "none";
    }
  } else {
    document.querySelector(".recipe-modal").style.display = "flex";
    document.querySelector(".card-container").style.display = "none";
  }
});
window.addEventListener("load", displayDailyBestRecipies);

//----------------------------event Listeners--------------------------------

searchInput.forEach((i) =>
  i.addEventListener("keyup", function (e) {
    if (e.keyCode == "13") {
      loadSearchResults(i.value);
      i.value = "";
    }
  })
);

menuOptions.forEach((i) =>
  i.addEventListener("click", function () {
    redirectPage(i);
  })
);

recommendedDishes.forEach((dish) =>
  dish.addEventListener("click", function () {
    loadSearchResults(dish.children[1].innerHTML.toLowerCase());
  })
);

let count = 0;
const itemCount = image.length;
imageSliderPrev.style.display = "none";
imageSliderNext.addEventListener("click", showNextItem);
imageSliderPrev.addEventListener("click", showPreviousItem);

let ingredientNumber = 1;
document
  .querySelector(".add-ingredients")
  .addEventListener("click", function () {
    document.getElementById(
      "ingredients-form"
    ).innerHTML += `<div class="form-group">
    <label>Ingredient <span>${++ingredientNumber}</span></label>
    <input
      type="text"
      required name="ingredient ${ingredientNumber}"
      placeholder="'Qty,Unit,Des'"
    />
  </div>`;
  });

document.querySelector(".hamburger").addEventListener("click", function () {
  document.querySelector(".menu-items").classList.toggle("dropdown-menu");
});
