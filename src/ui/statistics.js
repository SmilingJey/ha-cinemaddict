import Component from "./component.js";
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import calcRating from '../utils/calc-rating';
import toastr from 'toastr';
import * as moment from 'moment';

const BAR_HEIGHT = 60;

const chartConfig = {
  plugins: [ChartDataLabels],
  type: `horizontalBar`,
  data: {
    labels: [`Sci-Fi`, `Animation`, `Fantasy`, `Comedy`, `TV Series`],
    datasets: [{
      data: [11, 8, 7, 4, 3],
      backgroundColor: `#ffe800`,
      hoverBackgroundColor: `#ffe800`,
      anchor: `start`
    }]
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 20
        },
        color: `#ffffff`,
        anchor: `start`,
        align: `start`,
        offset: 40,
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: `#ffffff`,
          padding: 100,
          fontSize: 20
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        barThickness: 24
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    }
  }
};

const TimeFilters = {
  [`all-time`]: (data) => data,
  [`today`]: (data) => moment().diff(data.userDetails.watchingDate, `hours`) < 24,
  [`week`]: (data) => moment().diff(data.userDetails.watchingDate, `days`) < 7,
  [`Month`]: (data) => moment().diff(data.userDetails.watchingDate, `days`) < 30,
  [`Year`]: (data) => moment().diff(data.userDetails.watchingDate, `days`) < 365,
};

/**
 * Компонент отображает статистику путешествия
 */
export default class Statistics extends Component {
  constructor({getDataCallback}) {
    super();
    this._getData = getDataCallback;
    this._statiscticsChart = null;
    this._onFilterChange = this._onFilterChange.bind(this);
    this._state.selectedFilter = `all-time`;
  }

  _createUi() {
    const html = /* html */ `<section class="statistic">
      <p class="statistic__rank">Your rank: <span class="statistic__rank-label">---</span></p>
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        <input type="radio" class="statistic__filters-input visually-hidden"
        name="statistic-filter" id="statistic-all-time" value="all-time"
        ${this._state.selectedFilter === `all-time` ? `checked` : ``}>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>
        <input type="radio" class="statistic__filters-input visually-hidden"
        name="statistic-filter" id="statistic-today" value="today"
        ${this._state.selectedFilter === `today` ? `checked` : ``}>
        <label for="statistic-today" class="statistic__filters-label">Today</label>
        <input type="radio" class="statistic__filters-input visually-hidden"
        name="statistic-filter" id="statistic-week" value="week"
        ${this._state.selectedFilter === `week` ? `checked` : ``}>
        <label for="statistic-week" class="statistic__filters-label">Week</label>
        <input type="radio" class="statistic__filters-input visually-hidden"
        name="statistic-filter" id="statistic-month" value="month"
        ${this._state.selectedFilter === `month` ? `checked` : ``}>
        <label for="statistic-month" class="statistic__filters-label">Month</label>
        <input type="radio" class="statistic__filters-input visually-hidden"
        name="statistic-filter" id="statistic-year" value="year"
        ${this._state.selectedFilter === `year` ? `checked` : ``}>
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>
      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text statistic__item-movies">--- <span
          class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text statistic__item-duration"></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text statistic__item-topgenre">---</p>
        </li>
      </ul>
      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </section>`;

    const component = Component._createElement(html);

    this._getData()
      .then(this._showStatistics.bind(this))
      .catch(this._showError.bind(this));

    return component;
  }

  _showStatistics(data) {
    if (!this._element) return;

    const filteredData = this._filterByTime(data);

    const rankElement = this._element.querySelector(`.statistic__rank-label`);
    rankElement.textContent = calcRating(data);

    const moviesCountElement = this._element.querySelector(`.statistic__item-movies`);
    moviesCountElement.textContent = this._calcWatchedMoviesCount(filteredData);

    const durationElement = this._element.querySelector(`.statistic__item-duration`);
    const duration = this._calcWatchingTime(filteredData);
    durationElement.innerHTML = /* html */ `${Math.floor(duration / 60)} <span
    class="statistic__item-description">h</span>
    ${duration % 60} <span class="statistic__item-description">m</span>`;

    const genreStatistic = this._calcGenreStatistic(filteredData);
    const chartData = this._getChartData(genreStatistic);

    const topGenreElement = this._element.querySelector(`.statistic__item-topgenre`);
    if (chartData.labels.length) topGenreElement.textContent = chartData.labels[0];

    const canvasElement = this._element.querySelector(`.statistic__chart`);
    if (!this._statiscticsChart) {
      this._statiscticsChart = new Chart(canvasElement, chartConfig);
    } else {
      this._statiscticsChart.destroy();
      this._statiscticsChart = new Chart(canvasElement, chartConfig);
    }

    this._updateChart({
      canvas: canvasElement,
      chart: this._statiscticsChart,
      data: chartData,
    });
  }

  _filterByTime(data) {
    const statisticFilters = this._element.querySelector(`.statistic__filters`);
    const checkedFilter = statisticFilters.querySelector(`input[type=radio]:checked`);
    data = data.filter((film) => film.userDetails.alreadyWatched);
    if (checkedFilter) {
      const filtrerText = checkedFilter.value;
      if (TimeFilters.hasOwnProperty(filtrerText)) {
        return data.filter(TimeFilters[filtrerText]);
      }
    }
    return data;
  }

  _showError(err) {
    toastr.error(`Something went wrong. ` + err, `Error!`);
  }

  _calcWatchedMoviesCount(data) {
    return data.filter((film) => film.userDetails.alreadyWatched).length;
  }

  _calcWatchingTime(data) {
    return data.reduce((summ, film) => {
      summ += film.filmInfo.runtime;
      return summ;
    }, 0);
  }

  _calcGenreStatistic(data) {
    const genreStatistic = {};
    for (const film of data) {
      if (film.userDetails.alreadyWatched) {
        for (const genre of film.filmInfo.genre) {
          if (genreStatistic.hasOwnProperty(genre)) {
            genreStatistic[genre]++;
          } else {
            genreStatistic[genre] = 1;
          }
        }
      }
    }
    return genreStatistic;
  }

  _getChartData(statistic) {
    const sortedKeys = Object.keys(statistic).sort((a, b) => {
      return statistic[b] - statistic[a];
    });
    return {
      values: sortedKeys.map((genre) => statistic[genre]),
      labels: sortedKeys.map((genre) => genre),
    };
  }

  _updateChart({canvas, chart, data}) {
    chart.config.data.datasets[0].data = data.values;
    chart.data.labels = data.labels;
    canvas.height = BAR_HEIGHT * data.labels.length;
    chart.canvas.parentNode.style.height = `${BAR_HEIGHT * data.labels.length}px`;
    chart.update();
  }

  _bind() {
    const statisticFilters = this._element.querySelector(`.statistic__filters`);
    statisticFilters.addEventListener(`change`, this._onFilterChange);
  }

  _unbind() {
    const statisticFilters = this._element.querySelector(`.statistic__filters`);
    statisticFilters.removeEventListener(`change`, this._onFilterChange);
  }

  _onFilterChange() {
    const statisticFilters = this._element.querySelector(`.statistic__filters`);
    const checkedFilter = statisticFilters.querySelector(`input[type=radio]:checked`);
    this._state.selectedFilter = checkedFilter.value;
    this.render();
  }
}

