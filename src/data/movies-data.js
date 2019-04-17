import ServerAPI from './server-api.js';
import {cloneDeep} from 'lodash';
import OfflineProvider from './offline-provider';
import OfflineStore from './offline-store';

const RESOURSE = `movies`;

/**
 * Класс содержит данные точек путешествия
 */
export default class MoviesData {
  constructor({END_POINT, AUTHORIZATION}) {
    this._data = null;
    this._serverAPI = new ServerAPI({
      endPoint: END_POINT,
      authorization: AUTHORIZATION,
      resourceName: RESOURSE,
    });

    this._store = new OfflineStore({key: RESOURSE, storage: localStorage});
    this._api = new OfflineProvider({
      api: this._serverAPI,
      store: this._store,
      getId: (data) => data.id,
      generateId: (data) => {
        data.id = String(Date.now());
        return data.id;
      },
    });

    this._listeners = [];
    this._loadPromise = null;
  }

  /**
   * Подписка на изменение данных
   * @param {Function} callback - функция вызываемая при изменении данных
   */
  addListener(callback) {
    this._listeners.push(callback);
  }

  /**
   * Удаление подписки на изменение данных
   * @param {Function} callback
   */
  removeListener(callback) {
    this._listeners = this._listeners.filter((listener) => listener !== callback);
  }

  /**
   * Загрузка данных
   * @return {Promise} - промис
   */
  load() {
    return this._api.getResources()
      .then((data) => data.filter(Boolean))
      .then((data) => data.map(MoviesData.parseData))
      .then((data) => {
        this._data = data;
        this._loadPromise = null;
        this._emitDataChange(`load`);
        return this._data;
      });
  }

  /**
   * Возвращает промис с данными
   * @return {Array} - массив данных
   */
  get() {
    if (this._data) return Promise.resolve(this._data);
    if (!this._loadPromise) this._loadPromise = this.load();
    return this._loadPromise;
  }

  /**
   * Обновляет точку путешествия
   * @param {Object} movieData - новые данные
   * @return {Promise} - промис
   */
  update(movieData) {
    return this._api.updateResource({
      id: movieData.id,
      data: MoviesData.toRAW(movieData),
    })
      .then(MoviesData.parseData)
      .then((updatedData) => {
        const movieIndex = this._getIndexById(movieData.id);
        this._data[movieIndex] = updatedData;
        this._emitDataChange(`update`);
        return updatedData;
      });
  }

  /**
   * Удаление точки путешествич
   * @param {Object} data - данные точки путешествия
   * @return {Promise} - промис
   */
  delete({id}) {
    return this._api.deleteResource({id})
      .then(() => {
        this._data.splice(this._getIndexById(id), 1);
        this._emitDataChange(`delete`);
      });
  }

  sync() {
    this._api.syncResources();
  }

  /**
   * Событие о изменении данных
   * @param {String} eventName - имя события
   */
  _emitDataChange(eventName) {
    this._listeners.forEach((listener) => listener(eventName));
  }

  /**
   * Поиск в this._data по id
   * @param {String} id - идентификатор
   * @return {Number} - индекс в массиве this._data
   */
  _getIndexById(id) {
    return this._data.findIndex((data) => id === data.id);
  }

  /**
   * Преобразует данные точки путешествия в данные для отправки на сервер
   * @param {Object} data - точка путешествия
   * @return {Object} - данные в формате, принимаемом сервером
   */
  static toRAW(data) {
    return {
      id: data.id,
      [`film_info`]: {
        title: data.filmInfo.title,
        [`alternative_title`]: data.filmInfo.alternativeTitle,
        [`total_rating`]: data.filmInfo.totalRating,
        poster: data.filmInfo.poster,
        [`age_rating`]: data.filmInfo.ageRating,
        director: data.filmInfo.director,
        writers: data.filmInfo.writers.slice(),
        actors: data.filmInfo.actors.slice(),
        release: {
          date: data.filmInfo.release.date,
          [`release_country`]: data.filmInfo.release.releaseCountry,
        },
        runtime: data.filmInfo.runtime,
        genre: data.filmInfo.genre.slice(),
        description: data.filmInfo.description
      },
      [`user_details`]: {
        [`personal_rating`]: data.userDetails.personalRating,
        watchlist: data.userDetails.watchlist,
        [`already_watched`]: data.userDetails.alreadyWatched,
        [`watching_date`]: data.userDetails.watchingDate,
        favorite: data.userDetails.favorite,
      },
      comments: cloneDeep(data.comments)
    };
  }

  /**
   * Преобразует данные полученные от сервера в объект точки путешествия
   * @param {Object} data - данные сервера
   * @return {Object} - точка путешествия
   */
  static parseData(data) {
    return {
      id: data.id,
      filmInfo: {
        title: data.film_info.title,
        alternativeTitle: data.film_info.alternative_title,
        totalRating: data.film_info.total_rating,
        poster: data.film_info.poster,
        ageRating: data.film_info.age_rating,
        director: data.film_info.director,
        writers: data.film_info.writers.slice(),
        actors: data.film_info.actors.slice(),
        release: {
          date: data.film_info.release.date,
          releaseCountry: data.film_info.release.release_country,
        },
        runtime: data.film_info.runtime,
        genre: data.film_info.genre.slice(),
        description: data.film_info.description
      },
      userDetails: {
        personalRating: data.user_details.personal_rating,
        watchlist: data.user_details.watchlist,
        alreadyWatched: data.user_details.already_watched,
        watchingDate: data.user_details.watching_date,
        favorite: data.user_details.favorite,
      },
      comments: cloneDeep(data.comments)
    };
  }
}
