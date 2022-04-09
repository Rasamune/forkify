class SearchView {
    _parentElement = document.querySelector('.search');

    getQuery() {
        const query = this._parentElement.querySelector('.search__field').value;
        this._clearInput();
        return query;
    }

    _clearInput() {
        this._parentElement.querySelector('.search__field').value = '';
    }

    addHandlerSearch(handler) {
        // Search when Search button pressed
        this._parentElement.addEventListener('submit', (e) => {
            e.preventDefault();
            handler();
        });

        // Search on Page Load
        window.addEventListener('load', (e) => {
            handler();
        });
    }
}

export default new SearchView();