import Component from './component';
import FilmCard from './film-card';
import removeChilds from '../utils/remove-childs';

const FILMS_COUNT = 2;

export default class FilmsExtra extends Component {
  constructor({config, moviesData}) {
    super();
    this._filmsCards = [];
    this._moviesData = moviesData;
    this._title = config.title;
    this._sortFunction = config.sortFunction;
    this._filterFunction = () => true;
  }

  _createUi() {
    const html = /* html */`<section class="films-list--extra">
      <h2 class="films-list__title">${this._title}</h2>
      <div class="films-list__container">${this._showLoading()}</div>
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

  _showError() {
    const listElement = this._element.querySelector(`.films-list__container`);
    removeChilds(listElement);
    const html = /* html */`<p class="films-list__error">Something went wrong while
    loading movies. Check your connection or try again later</p>`;
    listElement.appendChild(Component._createElement(html));
  }

  _showCards(filmsData) {
    const listElement = this._element.querySelector(`.films-list__container`);
    removeChilds(listElement);
    const sortedFilms = filmsData.sort(this._sortFunction);
    const showedFilms = sortedFilms.slice(0, FILMS_COUNT);
    const fragment = document.createDocumentFragment();
    this._filmsCards = showedFilms.map((data) => new FilmCard({
      data,
      movieData: this._moviesData,
      noControls: true,
    }));
    for (const filmCard of this._filmsCards) {
      fragment.appendChild(filmCard.render());
    }
    listElement.appendChild(fragment);
  }

  unrender() {
    this._filmsCards.forEach((filmCard) => filmCard.unrender());
    this.super();
  }
}
