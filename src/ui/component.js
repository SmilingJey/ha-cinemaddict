/**
 * Базовый класс компонента
 */
export default class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate BaseComponent, only concrete one.`);
    }

    this._element = null;
    this._state = {};
    this._listeners = [];
    this._isHidden = false;
  }

  /**
   * Отрисовка компонента
   * @return {Node}
   */
  render() {
    if (this._element) {
      const pageY = this._element.scrollTop;
      this._unbind();
      const parentNode = this._element.parentNode;
      if (parentNode) {
        this._saveState();
        const newElement = this._createUi();

        parentNode.replaceChild(newElement, this._element);

        this._element = newElement;
      }
      this._element.scrollTop = pageY;
    } else {
      this._element = this._createUi();
    }
    this._bind();

    if (this._isHidden) this._element.classList.add(`visually-hidden`);
    else this._element.classList.remove(`visually-hidden`);


    return this._element;
  }

  /**
   * Удаление компонента
   */
  unrender() {
    if (this._element === null) return;
    this._saveState();
    this._unbind();
    this._element.remove();
    this._element = null;
    this._state = {};
  }

  /**
   * Удаление обработчка событий
   * @param {*} event - имя события
   * @param {*} callback - обработчик
   */
  addEventListener(event, callback) {
    this._listeners.push({
      event,
      callback,
    });
  }

  /**
   * Удаление обработчка событий
   * @param {*} event - имя события
   * @param {*} callback - обработчик
   */
  removeEventListener(event, callback) {
    this._listeners = this._listeners.filter((listener) => {
      return listener.callback !== callback && listener.event !== event;
    });
  }

  /**
   * Вызов обработчиков событий
   * @param {*} event - имя события
   * @param {*} data - данные события
   */
  _emitEvent(event, data = null) {
    this._listeners.forEach((listener) => {
      if (listener.event === event) listener.callback(data);
    });
  }

  /**
   * Создание отображения компонента
   */
  _createUi() {}

  /**
   * Привязка обработчиков событий
   */
  _bind() {}

  /**
   * Удалнение обработчиков событий
   */
  _unbind() {}

  /**
   * Сохранение состояния компонента перед перерисовкой
   */
  _saveState() {}

  /**
   * Создание интерфейса
   * @param {String} innerHTML - html
   * @return {Node}
   */
  static _createElement(innerHTML) {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = innerHTML;
    return newElement.firstChild;
  }

  hide() {
    if (this._element) this._element.classList.add(`visually-hidden`);
    this._isHidden = true;
  }

  unhide() {
    if (this._element) this._element.classList.remove(`visually-hidden`);
    this._isHidden = false;
  }
}
