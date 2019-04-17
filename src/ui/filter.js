import Component from './component';
import {cloneDeep} from 'lodash';

export default class Filter extends Component {
  constructor({data, getDataCallback}) {
    super();
    this._data = cloneDeep(data);
    this._state.count = 0;
    this._state.isActive = this._data.isActive;
    this._getData = getDataCallback;
    this._onClick = this._onClick.bind(this);
  }

  setActiveLink(link) {
    this._state.isActive = (link === this._data.link);
    this.render();
  }

  _createUi() {
    this._state.count = 0;
    const html = /* html */`<a
      href="${this._data.link}"
      class="main-navigation__item ${this._state.isActive ? `main-navigation__item--active` : ``}">
      ${this._data.text}
      <span class="main-navigation__item-count">---</span>
    </a>`;

    this._getData()
      .then(this._showCount.bind(this))
      .catch(this._showCountError.bind(this));
    return Component._createElement(html);
  }

  _showCount(data) {
    const countElement = this._element.querySelector(`.main-navigation__item-count`);
    countElement.textContent = data.filter(this._data.filterFunction).length;
  }

  _showCountError() {
    const countElement = this._element.querySelector(`.main-navigation__item-count`);
    countElement.textContent = `---`;
  }

  _bind() {
    this._element.addEventListener(`click`, this._onClick);
  }

  _unbind() {
    this._element.removeEventListener(`click`, this._onClick);
  }

  _onClick(evt) {
    this._emitEvent(`click`, {
      link: this._data.link,
      filterFunction: this._data.filterFunction
    });
    evt.preventDefault();
  }
}
