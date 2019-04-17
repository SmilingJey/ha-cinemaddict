import Component from './component';

export default class StatisticsButton extends Component {
  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._state.isActive = false;
  }

  setActive(isActive) {
    this._state.isActive = isActive;
    this.render();
  }

  _createUi() {
    const html = /* html */`<a href="#stats" class="main-navigation__item
    main-navigation__item--additional ${this._state.isActive ? `main-navigation__item--active` : ``}">Stats</a>`;
    return Component._createElement(html);
  }

  _bind() {
    this._element.addEventListener(`click`, this._onClick);
  }

  _unbind() {
    this._element.removeEventListener(`click`, this._onClick);
  }

  _onClick(evt) {
    evt.preventDefault();
    this._emitEvent(`click`);
  }
}
