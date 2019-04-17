import Component from './component';
import calcRating from '../utils/calc-rating';

export default class ProfileRating extends Component {
  constructor({getDataCallback}) {
    super();
    this._getData = getDataCallback;
  }

  _createUi() {
    const html = /* html */ `<p class="profile__rating">Profile rating: </p>`;
    this._getData()
      .then(this._showRating.bind(this))
      .catch(this._showError.bind(this));
    return Component._createElement(html);
  }

  _showRating(data) {
    this._element.textContent = `Profile rating: ${calcRating(data)}`;
  }

  _showError() {
    this._element.textContent = `Profile rating: `;
  }
}
