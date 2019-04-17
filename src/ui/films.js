import Component from './component';
import FilmsList from './films-list';
import FilmsExtra from './films-extra';

export default class Films extends Component {
  constructor({moviesData}) {
    super();

    this._filmsList = new FilmsList({moviesData});

    this._topRatedFilms = new FilmsExtra({
      config: {
        title: `Top rated`,
        sortFunction: (film1, film2) => {
          return film2.filmInfo.totalRating - film1.filmInfo.totalRating;
        }
      },
      moviesData,
    });

    this._mostCommentedFilms = new FilmsExtra({
      config: {
        title: `Most commented`,
        sortFunction: (film1, film2) => {
          return film2.comments.length - film1.comments.length;
        }
      },
      moviesData,
    });
  }

  getFilmList() {
    return this._filmsList;
  }

  _createUi() {
    const html = /* html */ `<section class="films"></section>`;
    const component = Component._createElement(html);
    component.appendChild(this._filmsList.render());
    component.appendChild(this._topRatedFilms.render());
    component.appendChild(this._mostCommentedFilms.render());
    return component;
  }

  unrender() {
    this._filmsList.unrender();
    this._topRatedFilms.unrender();
    this._mostCommentedFilms.unrender();
    this.super();
  }

  _bind() {
  }

  _unbind() {
  }
}
