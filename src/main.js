import StatisticsButton from './ui/statistics-button';
import MoviesData from './data/movies-data';
import initFilters from './controllers/init-filters';
import ProfileRating from './ui/profile-rating';
import FooterStatistics from './ui/footer-statistics';
import initSearch from './controllers/init-search';
import initPageSwitch from './controllers/init-page-switch';
import Films from './ui/films';
import Statistics from './ui/statistics';
import initOfflineController from './controllers/init-offline-controller';

const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;
const AUTHORIZATION = `Basic SmilingJey`;

// ------------------------------------
const moviesData = new MoviesData({END_POINT, AUTHORIZATION});

const mainElement = document.querySelector(`main`);

const films = new Films({moviesData});
mainElement.appendChild(films.render());

const statistics = new Statistics({getDataCallback: moviesData.get.bind(moviesData)});
statistics.hide();
mainElement.appendChild(statistics.render());
// фильтры
const filters = initFilters({moviesData, filmsList: films.getFilmList()});
const navigatorElement = document.querySelector(`.main-navigation`);
for (const filter of filters) {
  navigatorElement.appendChild(filter.render());
}

// кнопка статистики
const statisticsButton = new StatisticsButton();
navigatorElement.appendChild(statisticsButton.render());

// рейтинг профиля в заголовке
const profileRating = new ProfileRating({
  getDataCallback: moviesData.get.bind(moviesData)
});
moviesData.addListener(profileRating.render.bind(profileRating));
const profileRatingElement = document.querySelector(`.header__profile`);
profileRatingElement.appendChild(profileRating.render());

// количество фильмов внизу страницы
const footerStatistics = new FooterStatistics({
  getDataCallback: moviesData.get.bind(moviesData)
});
const footerStatisticsElement = document.querySelector(`.footer__statistics`);
footerStatisticsElement.appendChild(footerStatistics.render());

// настройка поиска
initSearch({filmsList: films.getFilmList(), filters});

// настройка переключения между страницами
initPageSwitch({
  statisticsButton,
  filters,
  films,
  statistics,
});

initOfflineController({moviesData});
