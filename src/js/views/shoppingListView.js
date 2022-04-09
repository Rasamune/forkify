import View from './View.js';
import icons from 'url:../../img/icons.svg';
import fracty from 'fracty';

class ShoppingListView extends View {
    _parentElement = document.querySelector('.shopping__list');
    _shoppingListContainer = document.querySelector('.shopping');

    updateContainerHeight() {
        const recipeEl = document.querySelector('.recipe');
        const headerEl = document.querySelector('.header');
        const totalHeight = recipeEl.offsetHeight + headerEl.offsetHeight;
        this._shoppingListContainer.style.height = `${totalHeight}px`;
    }

    shoppingListButton() {
        if(!this._data) return;
        const shoppingButton = this._parentElement.closest('.nav__item').querySelector('.nav__btn--shopping-cart');

        if(this._data.length !== 0) {
            shoppingButton.classList.remove('hidden');
        } else {
            shoppingButton.classList.add('hidden');
        }
    }

    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }

    _generateMarkup() {
        const id = window.location.hash.slice(1);

        return this._data.map(recipe => {
            return `
                <li class="preview">
                    <a class="preview__link" href="#${recipe.id}">
                    <div class="preview__data">
                        <h4 class="preview__title">
                        ${recipe.title}
                        </h4>
                        <ul class="recipe__ingredient-list">
                            ${recipe.ingredients
                                .map(this._generateMarkupIngredient)
                                .join('')
                            }
                        </ul>
                    </div>
                    </a>
                </li>
            `;
        }).join('')
    }

    _generateMarkupIngredient(ing) {
        return `
            <li class="recipe__ingredient">
                <svg class="recipe__icon">
                    <use href="${icons}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${ing.quantity ? fracty(ing.quantity).toString() : ''}</div>
                <div class="recipe__description">
                    <span class="recipe__unit">${ing.unit}</span>
                    ${ing.description}
                </div>
            </li>
        `;
    }
}

export default new ShoppingListView();