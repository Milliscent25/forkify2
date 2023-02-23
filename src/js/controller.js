import * as  model from './model';
import { MODAL_CLOSE_SEC } from './config';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';




import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';


// if(module.hot){
//   module.hot.accept()
// }

// const recipeContainer = document.querySelector('.recipe');

// const timeout = function (s) {
//   return new Promise(function (_, reject) {
//     setTimeout(function () {
//       reject(new Error(`Request took too long! Timeout after ${s} second`));
//     }, s * 1000);
//   });
// };

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////



// to make an AJAX to an API WE USE THE FETCH FUCTION- fetch funcction will return a promise then in a asyn fuction(its runs un the background) then we await that promise so basically we will stop the code execution 
const controlRecipes = async function () {
  try {

    const id = window.location.hash.slice(1);
    // console.log(id)

    if (!id) return;
    recipeView.renderSpinner();

    //0)update results view to mark searchresults
    resultsView.update(model.getSearchResultsPage());

    //1) udateing  bookmarkview
    bookmarksView.update(model.state.bookmarks);

    // 2) loading recipes
    await model.loadRecipe(id);

    //3) rendering recipes
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);

  }


};


const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) get search query 
    const query = searchView.getQuery();
    if (!query) return;

    // 2) load search results 
    await model.loadSearchResults(query)

    //3) Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());


    //4 Render initial paginatio buttons
    paginationView.render(model.state.search);

  } catch (err) {
    console.log(err)
  }
};

const controlPagination = function (goToPage) {
  //1) Render NEW results
  // resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(goToPage));


  //2 Render NEW paginatioN buttons
  paginationView.render(model.state.search);

}

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings)

  //update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}



const controlAddBookmark = function () {
  // add/remove bookmarked
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else
    model.deleteBookmark(model.state.recipe.id);

  // update recipe
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks)
};


const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    // upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    // success Message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //window.history.back

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000);

  } catch (err) {
    console.error('', err);
    addRecipeView.renderError(err.message)
  }

};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);

};
init();




// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe)



