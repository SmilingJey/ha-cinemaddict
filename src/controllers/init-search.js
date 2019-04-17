import debounce from '../utils/debounce';

export default function initSearch({filmsList, filters}) {
  const searchInputElement = document.querySelector(`.search__field`);
  searchInputElement.addEventListener(`keyup`, debounce(() => {
    const searchText = searchInputElement.value;
    filmsList.setFilterFunction((film) => film.filmInfo.title.toLowerCase().includes(searchText.toLowerCase()));
  }));

  for (const filter of filters) {
    filter.addEventListener(`click`, () => {
      searchInputElement.value = ``;
    });
  }
}
