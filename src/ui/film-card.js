/* eslint-disable max-lines-per-function */
import Component from './component';
import {cloneDeep} from 'lodash';
import toastr from 'toastr';
import FilmDetailes from './film-details';

const MAX_DESCRIPTION_LENGTH = 140;

export default class FilmCard extends Component {
  constructor({data, movieData, noControls = false}) {
    super();
    this._data = cloneDeep(data);
    this._movieData = movieData;
    this._noControls = noControls;
    this._onAddToWatchlistClick = this._onAddToWatchlistClick.bind(this);
    this._onMarkAsWatchedClick = this._onMarkAsWatchedClick.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
    this._onCommentsClick = this._onCommentsClick.bind(this);
  }

  _createUi() {
    const html = /* html */`<article class="film-card
    ${this._noControls ? `film-card--no-controls` : ``}">
        <h3 class="film-card__title">${this._data.filmInfo.title}</h3>
        <p class="film-card__rating">${this._data.filmInfo.totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">
            ${new Date(this._data.filmInfo.release.date).getFullYear()}
          </span>
          <span class="film-card__duration">
            ${this._getFilmDurationText()}
          </span>
          <span class="film-card__genre">${this._data.filmInfo.genre[0]}</span>
        </p>
        <img src="./${this._data.filmInfo.poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${this._getDescription()}</p>
        <button class="film-card__comments">${this._data.comments.length} comments</button>

        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist
           ${this._data.userDetails.watchlist ? `film-card__controls-item-active` : ``} ">WL</button>
          <button class="film-card__controls-item button
          ${this._data.userDetails.alreadyWatched ? `film-card__controls-item-active` : ``}
          film-card__controls-item--mark-as-watched">WTCHD</button>
          <button class="film-card__controls-item button
          ${this._data.userDetails.favorite ? `film-card__controls-item-active` : ``}
          film-card__controls-item--favorite">FAV</button>
        </form>
      </article>`;

    return Component._createElement(html);
  }

  _getDescription() {
    if (this._data.filmInfo.description.length <= MAX_DESCRIPTION_LENGTH) {
      return this._data.filmInfo.description;
    }

    return this._data.filmInfo.description.substr(0, MAX_DESCRIPTION_LENGTH) + `...`;
  }

  _getFilmDurationText() {
    const min = this._data.filmInfo.runtime;
    return min < 60 ? `${min}m` : `${Math.floor(min / 60)}h&nbsp;${min % 60}m`;
  }

  _bind() {
    const addToWatchListButton = this._element.querySelector(`.film-card__controls-item--add-to-watchlist`);
    addToWatchListButton.addEventListener(`click`, this._onAddToWatchlistClick);

    const markAsWatchedButton = this._element.querySelector(`.film-card__controls-item--mark-as-watched`);
    markAsWatchedButton.addEventListener(`click`, this._onMarkAsWatchedClick);

    const favoriteButton = this._element.querySelector(`.film-card__controls-item--favorite`);
    favoriteButton.addEventListener(`click`, this._onFavoriteClick);

    const commentsButton = this._element.querySelector(`.film-card__comments`);
    commentsButton.addEventListener(`click`, this._onCommentsClick);
  }

  _unbind() {
    const addToWatchListButton = this._element.querySelector(`.film-card__controls-item--add-to-watchlist`);
    addToWatchListButton.removeEventListener(`click`, this._onAddToWatchlistClick);

    const markAsWatchedButton = this._element.querySelector(`.film-card__controls-item--mark-as-watched`);
    markAsWatchedButton.removeEventListener(`click`, this._onMarkAsWatchedClick);

    const favoriteButton = this._element.querySelector(`.film-card__controls-item--favorite`);
    favoriteButton.removeEventListener(`click`, this._onFavoriteClick);

    const commentsButton = this._element.querySelector(`.film-card__comments`);
    commentsButton.removeEventListener(`click`, this._onCommentsClick);
  }

  _setButtonActive(buttonElement, isActive) {
    if (isActive) buttonElement.classList.add(`film-card__controls-item-active`);
    else buttonElement.classList.remove(`film-card__controls-item-active`);
  }

  _onAddToWatchlistClick(evt) {
    evt.preventDefault();
    const newData = cloneDeep(this._data);
    newData.userDetails.watchlist = !newData.userDetails.watchlist;
    this._movieData.update(newData)
      .then((data) => {
        this._data = data;
        const addToWatchListButton = this._element.querySelector(`.film-card__controls-item--add-to-watchlist`);
        this._setButtonActive(addToWatchListButton, data.userDetails.watchlist);
      })
      .catch((err) => {
        toastr.error(`Something went wrong. ` + err, `Error!`);
      });
  }

  _onMarkAsWatchedClick(evt) {
    evt.preventDefault();
    const newData = cloneDeep(this._data);
    newData.userDetails.alreadyWatched = !newData.userDetails.alreadyWatched;
    newData.userDetails.watchingDate = Date.now();
    this._movieData.update(newData)
      .then((data) => {
        this._data = cloneDeep(data);
        const markAsWatchedButton = this._element.querySelector(`.film-card__controls-item--mark-as-watched`);
        this._setButtonActive(markAsWatchedButton, data.userDetails.alreadyWatched);
      })
      .catch((err) => {
        toastr.error(`Something went wrong. ` + err, `Error!`);
      });
  }

  _onFavoriteClick(evt) {
    evt.preventDefault();
    const newData = cloneDeep(this._data);
    newData.userDetails.favorite = !newData.userDetails.favorite;
    this._movieData.update(newData)
      .then((data) => {
        this._data = cloneDeep(data);
        const favoriteButton = this._element.querySelector(`.film-card__controls-item--favorite`);
        this._setButtonActive(favoriteButton, data.userDetails.favorite);
      })
      .catch((err) => {
        toastr.error(`Something went wrong. ` + err, `Error!`);
      });
  }

  _onCommentsClick(evt) {
    evt.preventDefault();
    const filmDetailes = new FilmDetailes({
      data: this._data,
      movieData: this._movieData,
    });
    filmDetailes.addEventListener(`close`, (data) => {
      this._data = cloneDeep(data);
      this.render();
    });
    document.querySelector(`body`).appendChild(filmDetailes.render());
  }
}
