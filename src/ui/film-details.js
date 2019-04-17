/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import Component from './component';
import {cloneDeep} from 'lodash';
import * as moment from 'moment';
import toastr from 'toastr';

const emotions = {
  [`neutral-face`]: `😐`,
  [`sleeping`]: `😴`,
  [`grinning`]: `😀`,
};

export default class FooterStatistics extends Component {
  constructor({data, movieData}) {
    super();
    this._data = cloneDeep(data);
    this._onClose = this._onClose.bind(this);
    this._movieData = movieData;

    this._onKeydown = this._onKeydown.bind(this);
    this._onWatchlistChange = this._onWatchlistChange.bind(this);
    this._onMarkAsAlreadyWatchedChange = this._onMarkAsAlreadyWatchedChange.bind(this);
    this._onFavoriteChange = this._onFavoriteChange.bind(this);
    this._onEmojiChange = this._onEmojiChange.bind(this);
    this._onWatchedReset = this._onWatchedReset.bind(this);
    this._onRatingChange = this._onRatingChange.bind(this);
    this._onSendComment = this._onSendComment.bind(this);
    this._state.animationOpen = true;
    this._state.selectedEmoji = `neutral-face`;
  }

  _createUi() {
    const html = /* html */ `<section class="film-details ${this._state.animationOpen ? `film-details__animation` : ``}">
        <form class="film-details__inner" action="" method="get">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${this._data.filmInfo.poster}" alt="">
              <p class="film-details__age">+${this._data.filmInfo.ageRating}</p>
            </div>
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${this._data.filmInfo.title}</h3>
                  <p class="film-details__title-original">${this._data.filmInfo.alternativeTitle}</p>
                </div>
                <div class="film-details__rating">
                  <p class="film-details__total-rating">${this._data.filmInfo.totalRating}</p>
                  <p class="film-details__user-rating">Your rate ${this._data.userDetails.personalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${this._data.filmInfo.director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${this._data.filmInfo.writers.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${this._data.filmInfo.actors.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">
                  ${moment(this._data.filmInfo.release.date).format(`D MMMM YYYY`)}
                  (${this._data.filmInfo.release.releaseCountry})</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${this._data.filmInfo.runtime} min</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${this._data.filmInfo.release.releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    ${this._data.filmInfo.genre.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(` `)}
                </tr>
              </table>
              <p class="film-details__film-description">
                ${this._data.filmInfo.description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._data.userDetails.watchlist ? `checked` : ``}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._data.userDetails.alreadyWatched ? `checked` : ``}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._data.userDetails.favorite ? `checked` : ``}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>

          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._data.comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${this._data.comments.map((comment) => /* html */` <li class="film-details__comment">
                <span class="film-details__comment-emoji">${emotions[comment.emotion]}</span>
                <div>
                  <p class="film-details__comment-text">${comment.comment}</p>
                  <p class="film-details__comment-info">
                    <span class="film-details__comment-author">${comment.author}</span>
                    <span class="film-details__comment-day">${moment(comment.date).fromNow()}</span>
                  </p>
                </div>
              </li>`).join(``)}
            </ul>

            <div class="film-details__new-comment">
              <div>
                <label for="add-emoji" class="film-details__add-emoji-label">
                ${emotions[this._state.selectedEmoji]}</label>
                <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">

                <div class="film-details__emoji-list">
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                  <label class="film-details__emoji-label" for="emoji-sleeping"
                   ${this._state.selectedEmoji === `sleeping` ? `checked` : ``}>😴</label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-neutral-face" value="neutral-face"
                  ${this._state.selectedEmoji === `neutral-face` ? `checked` : ``}>
                  <label class="film-details__emoji-label" for="emoji-neutral-face">😐</label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-grinning" value="grinning"
                  ${this._state.selectedEmoji === `grinning` ? `checked` : ``}>
                  <label class="film-details__emoji-label" for="emoji-grinning">😀</label>
                </div>
              </div>
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here" name="comment"></textarea>
              </label>
              <button class="button film-details__comment-submit">Submit</button>
            </div>
          </section>

          <section class="film-details__user-rating-wrap
          ${this._data.userDetails.alreadyWatched ? `` : `visually-hidden`}">
            <div class="film-details__user-rating-controls">
              <span class="film-details__watched-status film-details__watched-status--active">Already watched</span>
              <button class="film-details__watched-reset" type="button">undo</button>
            </div>

            <div class="film-details__user-score">
              <div class="film-details__user-rating-poster">
                <img src="images/posters/blackmail.jpg" alt="film-poster" class="film-details__user-rating-img">
              </div>

              <section class="film-details__user-rating-inner">
                <h3 class="film-details__user-rating-title">${this._data.filmInfo.title}</h3>

                <p class="film-details__user-rating-feelings">How you feel it?</p>

                <div class="film-details__user-rating-score">
                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1"
                  ${this._data.userDetails.personalRating === `1` ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-1">1</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2"
                  ${this._data.userDetails.personalRating === `2` ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-2">2</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3"
                  ${this._data.userDetails.personalRating === `3` ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-3">3</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4"
                  ${this._data.userDetails.personalRating === `4` ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-4">4</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5"
                  ${this._data.userDetails.personalRating === `5` ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-5">5</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6"
                  ${this._data.userDetails.personalRating === `6` ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-6">6</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7"
                  ${this._data.userDetails.personalRating === `7` ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-7">7</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8"
                  ${this._data.userDetails.personalRating === `8` ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-8">8</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9"
                  ${this._data.userDetails.personalRating === `9` ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-9">9</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="10" id="rating-10"
                  ${this._data.userDetails.personalRating === `10` ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-10">10</label>
                </div>
              </section>
            </div>
          </section>
        </form>
      </section>`;
    this._state.animationOpen = false;
    const component = Component._createElement(html);
    return component;
  }

  _bind() {
    const closeButtonElement = this._element.querySelector(`.film-details__close-btn`);
    closeButtonElement.addEventListener(`click`, this._onClose);
    document.addEventListener(`keydown`, this._onKeydown);
    const inputWatchlist = this._element.querySelector(`input[name=watchlist]`);
    inputWatchlist.addEventListener(`change`, this._onWatchlistChange);
    const inputAlreadyWatched = this._element.querySelector(`input[name=watched]`);
    inputAlreadyWatched.addEventListener(`change`, this._onMarkAsAlreadyWatchedChange);
    const inputFavorite = this._element.querySelector(`input[name=favorite]`);
    inputFavorite.addEventListener(`change`, this._onFavoriteChange);
    const emojiListElement = this._element.querySelector(`.film-details__emoji-list`);
    emojiListElement.addEventListener(`change`, this._onEmojiChange);
    const undoAlreadyWatchedElement = this._element.querySelector(`.film-details__watched-reset`);
    undoAlreadyWatchedElement.addEventListener(`click`, this._onWatchedReset);
    const ratingElement = this._element.querySelector(`.film-details__user-rating-score`);
    ratingElement.addEventListener(`change`, this._onRatingChange);
    const submitCommentElement = this._element.querySelector(`.film-details__comment-submit`);
    submitCommentElement.addEventListener(`click`, this._onSendComment);
  }

  _unbind() {
    const closeButtonElement = this._element.querySelector(`.film-details__close-btn`);
    closeButtonElement.removeEventListener(`click`, this._onClose);
    document.removeEventListener(`keydown`, this._onKeydown);
    const inputWatchlist = this._element.querySelector(`input[name=watchlist]`);
    inputWatchlist.removeEventListener(`change`, this._onWatchlistChange);
    const inputAlreadyWatched = this._element.querySelector(`input[name=watched]`);
    inputAlreadyWatched.removeEventListener(`change`, this._onMarkAsAlreadyWatchedChange);
    const inputFavorite = this._element.querySelector(`input[name=favorite]`);
    inputFavorite.removeEventListener(`change`, this._onFavoriteChange);
    const emojiListElement = this._element.querySelector(`.film-details__emoji-list`);
    emojiListElement.removeEventListener(`change`, this._onEmojiChange);
    const undoAlreadyWatchedElement = this._element.querySelector(`.film-details__watched-reset`);
    undoAlreadyWatchedElement.removeEventListener(`click`, this._onWatchedReset);
    const ratingElement = this._element.querySelector(`.film-details__user-rating-score`);
    ratingElement.removeEventListener(`change`, this._onRatingChange);
    const submitCommentElement = this._element.querySelector(`.film-details__comment-submit`);
    submitCommentElement.removeEventListener(`click`, this._onSendComment);
  }

  _onClose() {
    this.unrender();
    this._emitEvent(`close`, this._data);
  }

  _onWatchlistChange(evt) {
    evt.preventDefault();
    const newData = cloneDeep(this._data);
    newData.userDetails.watchlist = !newData.userDetails.watchlist;
    this._movieData.update(newData)
      .then((data) => {
        this._data = cloneDeep(data);
        this.render();
      })
      .catch((err) => {
        toastr.error(`Something went wrong. ` + err, `Error!`);
      });
  }

  _onMarkAsAlreadyWatchedChange(evt) {
    evt.preventDefault();
    const newData = cloneDeep(this._data);
    newData.userDetails.alreadyWatched = !newData.userDetails.alreadyWatched;
    newData.userDetails.watchingDate = Date.now();
    this._movieData.update(newData)
      .then((data) => {
        this._data = cloneDeep(data);
        this.render();
      })
      .catch((err) => {
        toastr.error(`Something went wrong. ` + err, `Error!`);
      });
  }

  _onFavoriteChange(evt) {
    evt.preventDefault();
    const newData = cloneDeep(this._data);
    newData.userDetails.favorite = !newData.userDetails.favorite;
    this._movieData.update(newData)
      .then((data) => {
        this._data = cloneDeep(data);
        this.render();
      })
      .catch((err) => {
        toastr.error(`Something went wrong. ` + err, `Error!`);
      });
  }

  _onKeydown(evt) {
    const ESC_KEYCODE = 27;
    if (evt.keyCode === ESC_KEYCODE) {
      this._onClose();
    }

    const ENTER_KEYCODE = 13;
    if (event.ctrlKey && event.keyCode === ENTER_KEYCODE) {
      this._sendComment();
    }
  }

  _onEmojiChange() {
    const emojiListElement = this._element.querySelector(`.film-details__emoji-list`);
    const checkedEmojiElement = emojiListElement.querySelector(`input[type=radio]:checked`);
    if (checkedEmojiElement) this._state.selectedEmoji = checkedEmojiElement.value;
    this.render();
  }

  _onWatchedReset(evt) {
    evt.preventDefault();
    const newData = cloneDeep(this._data);
    newData.userDetails.alreadyWatched = false;
    this._movieData.update(newData)
      .then((data) => {
        this._data = cloneDeep(data);
        this.render();
      })
      .catch((err) => {
        toastr.error(`Something went wrong. ` + err, `Error!`);
      });
  }

  _onRatingChange(evt) {
    evt.preventDefault();
    const newData = cloneDeep(this._data);
    newData.userDetails.personalRating = evt.target.value;
    this._movieData.update(newData)
      .then((data) => {
        this._data = cloneDeep(data);
        this.render();
      })
      .catch((err) => {
        toastr.error(`Something went wrong. ` + err, `Error!`);
      });
  }

  _onSendComment(evt) {
    evt.preventDefault();
    this._sendComment();
  }

  _sendComment() {
    const commentElement = this._element.querySelector(`.film-details__comment-input`);
    const commentText = commentElement.value;
    if (!commentText) return;
    const newData = cloneDeep(this._data);
    newData.comments.unshift({
      [`author`]: `You`,
      [`emotion`]: this._state.selectedEmoji,
      [`comment`]: commentText,
      [`date`]: Date.now()
    });
    this._movieData.update(newData)
      .then((data) => {
        this._data = cloneDeep(data);
        this.render();
      })
      .catch((err) => {
        toastr.error(`Something went wrong. ` + err, `Error!`);
      });
  }
}
