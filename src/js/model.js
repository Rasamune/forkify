import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { KEY } from './config.js';
import { RES_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';

//////////////////////////
// STATE OBJECT

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RES_PER_PAGE,
        page: 1
    },
    bookmarks: [],
    shoppingList: []
}

//////////////////////////
// RECIPE

const createRecipeObject = (data) => {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key })
    }
}

export const loadRecipe = async (id) => {
    try {
        // Loading Recipe
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
        
        let { recipe } = data.data;
        state.recipe = createRecipeObject(data);

        if(state.bookmarks.some(bookmark => bookmark.id === id)) {
            state.recipe.bookmarked = true;
        } else {
            state.recipe.bookmarked = false;
        }

        if(state.shoppingList.some(shoppingItem => shoppingItem.id === id)) {
            state.recipe.ingredientsAdded = true;
        } else {
            state.recipe.ingredientsAdded = false;
        }

    } catch(err) {
        console.log(`${err} 💥💥💥💥`);
        throw err;
    }
}

export const uploadRecipe = async (newRecipe) => {
    try {
        const ingredients = Object.entries(newRecipe)
        .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
        .map(ing => {
            const ingArr = ing[1].split(',').map(el => el.trim());
            if(ingArr.length !== 3) 
                throw new Error('Wrong ingredient format! Please use the correct format :)');
            const [ quantity, unit, description ] = ingArr;
            return { 
                quantity: quantity ? +quantity : null, 
                unit, 
                description 
            };
        });

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients
        }

        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);

    } catch (err) {
        throw err;
    }
}

//////////////////////////
// SEARCH

export const loadSearchResults = async (query) => {
    try {
        //
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);


        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                sourceUrl: rec.source_url,
                image: rec.image_url,
                servings: rec.servings,
                cookingTime: rec.cooking_time,
                ingredients: rec.ingredients,
                ...(rec.key && { key: rec.key })
            }
        });
        state.search.page = 1;
    } catch(err) {
        console.log(`${err} 💥💥💥💥`);
        throw err;
    }
}

export const getSearchResultsPage = (page = state.search.page) => {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage; // 0
    const end = page * state.search.resultsPerPage; // 9

    return state.search.results.slice(start, end);
}

export const updateServings = (newServings) => {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
        // newQTY = oldQTY * newServings / oldServings
    });

    state.recipe.servings = newServings;
}

//////////////////////////
// BOOKMARKS

export const addBookmark = (recipe) => {
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmark
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks();
}

export const deleteBookmark = (id) => {
    // Delete Bookmark
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    // Mark current recipe as not bookmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();
}

const persistBookmarks = () => {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

//////////////////////////
// SHOPPING LIST

export const addIngredientsShoppingList = (recipe) => {
    // Add Recipe to Shopping List
    state.shoppingList.push(recipe);

    // Mark current recipe as added to Shopping List
    if(recipe.id === state.recipe.id) state.recipe.ingredientsAdded = true;

    persistShoppingList();
}

export const deleteIngredientsShoppingList = (id) => {
    // Delete Bookmark
    const index = state.shoppingList.findIndex(el => el.id === id);
    state.shoppingList.splice(index, 1);

    // Mark current recipe as not bookmarked
    if(id === state.recipe.id) state.recipe.ingredientsAdded = false;

    persistShoppingList();
}

const persistShoppingList = () => {
    localStorage.setItem('shoppingList', JSON.stringify(state.shoppingList));
}

//////////////////////////
// INIT

const init = () => {
    const storageBookmarks = localStorage.getItem('bookmarks');
    if (storageBookmarks) state.bookmarks = JSON.parse(storageBookmarks);

    const storageShoppingList = localStorage.getItem('shoppingList');
    if (storageShoppingList) state.shoppingList = JSON.parse(storageShoppingList);
}
init();