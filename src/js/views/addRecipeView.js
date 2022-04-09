import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');
    _btnAddIngredient = document.querySelector('.ingredients__list');

    _message = 'Recipe was successfully uploaded :)';
    _ingredientNumber = 0;

    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
        this._addHandlerAddIngredient();
        this._addHandlerIngredientFieldChange();
    }

    _addIngredientField(e) {
        const btn = e.target.closest('.add__ingredient');
        if(!btn) return;

        this._ingredientNumber++;

        e.target.closest('.field__container').insertAdjacentHTML('beforebegin', this._generateMarkupInputField(this._ingredientNumber));
    }

    _ingredientFieldChange(e) {
        const parentField = e.target.closest('.field__container');
        const hiddenField = parentField.querySelector('.hidden--input');

        const inputFieldsData = [...parentField.querySelectorAll('input')]
            .filter(inp => !inp.classList.contains('hidden--input'))
            .map(inp => inp.value)
            .join(',');

        hiddenField.value = inputFieldsData;
    }

    toggleWindow() {
        this._window.classList.toggle('hidden');
        this._overlay.classList.toggle('hidden');
    }

    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerAddIngredient() {
        this._btnAddIngredient.addEventListener('click', this._addIngredientField.bind(this));
    }

    _addHandlerIngredientFieldChange() {
        this._btnAddIngredient.addEventListener('change', this._ingredientFieldChange.bind(this));
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const dataArr = [...new FormData(this._parentElement)];
            const data = Object.fromEntries(dataArr);
            console.log(data);
            handler(data);
        })
    }

    _generateMarkupInputField(ingredientNumber) {
        return `
            <div class="field__container">
                <label>Ingredient ${ingredientNumber}</label>
                <input
                class="hidden--input"
                value=",,"
                type="text"
                required
                name="ingredient-${ingredientNumber}"
                />
                <input
                type="text"
                required
                name="qty"
                placeholder="QTY"
                />
                <input
                type="text"
                required
                name="unit"
                placeholder="UNIT"
                />
                <input
                type="text"
                required
                name="description"
                placeholder="Name"
                />
            </div>
        `;
    }

    _generateMarkup() {}
}

export default new AddRecipeView();