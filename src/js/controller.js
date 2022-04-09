import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import shoppingListView from './views/shoppingListView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import shoppingListView from './views/shoppingListView.js';

const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);
    
    if(!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to make selected search result
    resultsView.update(model.getSearchResultsPage());
    
    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading Recipe
    await model.loadRecipe(id);
    
    // 3) Rendering Recipe
    recipeView.render(model.state.recipe);

    // 4) Update Shopping List Container Size
    shoppingListView.updateContainerHeight();
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
}

const controlSearchResults = async () => {
  try {
    // 1) Get Search Query
    let query = searchView.getQuery();
    const urlQueryAddress = window.location;
    const urlQuery = new URLSearchParams(urlQueryAddress.search);

    if(!query) {
      // 1.B) Get Query from page URL
      query = urlQuery.get('search');

      // If there are absolutely NO queries, exit
      if (!query) return;
    }
    resultsView.renderSpinner();

    // Redefine URL with search parameters & recipe hashtag
    urlQuery.set('search', query);
    window.history.replaceState({}, '', 
    `${location.pathname}?search=${urlQuery.get('search')}${window.location?.hash}`);

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);

  } catch(err) {
    console.error(err);
  }
}

const controlPagination = (goToPage) => {
  // 1) Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render new pagination buttons
  paginationView.render(model.state.search);
}

const controlServings = (newServings) => {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = () => {
  // Add or remove Bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id);
  
  // Update Recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
}

const controlShoppingList = () => {
  // Add or remove ingredients from Shopping List
  if(!model.state.recipe.ingredientsAdded) model.addIngredientsShoppingList(model.state.recipe)
  else model.deleteIngredientsShoppingList(model.state.recipe.id);

  // Update Recipe view
  recipeView.update(model.state.recipe);

  // Render ShoppingListView
  shoppingListView.render(model.state.shoppingList);
  shoppingListView.shoppingListButton();
}

const controlShoppingListRender = () => {
  shoppingListView.render(model.state.shoppingList);
  shoppingListView.shoppingListButton();
  shoppingListView.updateContainerHeight();
}

const controlAddRecipe = async (newRecipe) => {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload new Recipe data
    await model.uploadRecipe(newRecipe);

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(() => {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000);

  } catch(err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
}

const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerAddShoppingList(controlShoppingList);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  shoppingListView.addHandlerRender(controlShoppingListRender);
}
init();