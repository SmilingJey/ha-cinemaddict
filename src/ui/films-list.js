import Component from './component';
import FilmCard from './film-card';
import removeChilds from '../utils/remove-childs';
import toastr from 'toastr';

const INIT_SHOW_COUNT = 5;
const SHOW_MORE_COUNT = 5;

export default class FilmsList extends Component {
  constructor({moviesData}) {
    super();
    this._filmsCards = [];
    this._moviesData = moviesData;

    this._state.showCount = INIT_SHOW_COUNT;

    this._onShowMoreClick = this._onShowMoreClick.bind(this);
    this._filterFunction = () => true;
  }

  setFilterFunction(fn) {
    this._filterFunction = fn;
    this._state.showCount = INIT_SHOW_COUNT;
    this.render();
  }

  _createUi() {
    const html = /* html */`<section class="films-list">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
        <div class="films-list__container">${this._showLoading()}</div>
        <button class="films-list__show-more">Show more</button>
      </section>`;

    this._moviesData.get()
      .then(this._showCards.bind(this))
      .catch(this._showError.bind(this));
    return Component._createElement(html);
  }

  _showLoading() {
    return /* html */`<div class="lds-spinner"><div></div><div></div><div></div><div></div><div>
    </div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
  }

  _showError(err) {
    const listElement = this._element.querySelector(`.films-list__container`);
    removeChilds(listElement);
    const html = /* html */`<p class="films-list__error">Something went wrong while
    loading movies. Check your connection or try again later</p>`;
    listElement.appendChild(Component._createElement(html));
    toastr.error(`Something went wrong. ` + err, `Error!`);
  }

  _showEmptyMessage() {
    const listElement = this._element.querySelector(`.films-list__container`);
    removeChilds(listElement);
    const html = /* html */`<p class="films-list__error">No films found</p>`;
    listElement.appendChild(Component._createElement(html));
  }

  _showCards(filmsData) {
    const filteredFilms = filmsData.filter(this._filterFunction);
    const showedFilms = filteredFilms.slice(0, this._state.showCount);
    const listElement = this._element.querySelector(`.films-list__container`);
    removeChilds(listElement);
    if (!showedFilms.length) {
      this._showEmptyMessage();
    } else {
      const fragment = document.createDocumentFragment();
      this._filmsCards = showedFilms.map((data) => new FilmCard({
        data,
        movieData: this._moviesData,
        noControls: false,
      }));
      for (const filmCard of this._filmsCards) {
        fragment.appendChild(filmCard.render());
      }
      listElement.appendChild(fragment);
    }

    const showMoreElement = this._element.querySelector(`.films-list__show-more`);
    if (filteredFilms.length <= this._state.showCount) {
      showMoreElement.classList.add(`show-more__hidden`);
    } else {
      showMoreElement.classList.remove(`show-more__hidden`);
    }
  }

  unrender() {
    this._filmsCards.forEach((filmCard) => filmCard.unrender());
    this.super();
  }

  _bind() {
    const showMoreElement = this._element.querySelector(`.films-list__show-more`);
    showMoreElement.addEventListener(`click`, this._onShowMoreClick);
  }

  _unbind() {
    const showMoreElement = this._element.querySelector(`.films-list__show-more`);
    showMoreElement.removeEventListener(`click`, this._onShowMoreClick);
  }

  _onShowMoreClick() {
    this._state.showCount += SHOW_MORE_COUNT;
    this.render();
  }
}
