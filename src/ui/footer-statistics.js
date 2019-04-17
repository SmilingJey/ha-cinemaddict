import Component from './component';

export default class FooterStatistics extends Component {
  constructor({getDataCallback}) {
    super();
    this._getData = getDataCallback;
  }

  _createUi() {
    const html = /* html */ `<p></p>`;
    this._getData()
      .then(this._showRating.bind(this))
      .catch(this._showError.bind(this));
    return Component._createElement(html);
  }

  _showRating(data) {
    const count = data.length;
    this._element.textContent = `${count} movies inside`;
  }

  _showError() {
    this._element.textContent = `Many movies inside`;
  }
}
