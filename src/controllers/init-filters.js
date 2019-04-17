import Filter from '../ui/filter';

const filtersData = [
  {
    link: `#all`,
    text: `All movies`,
    filterFunction: () => true,
    isActive: true,
  },
  {
    link: `#watchlist`,
    text: `Watchlist`,
    filterFunction: (data) => data.userDetails.watchlist,
  },
  {
    link: `#history`,
    text: `History.`,
    filterFunction: (data) => data.userDetails.alreadyWatched,
  },
  {
    link: `#favorites`,
    text: `Favorites`,
    filterFunction: (data) => data.userDetails.favorite,
  },
];

export default function initFilters({moviesData, filmsList}) {
  const filters = filtersData.map((data) => {
    const filter = new Filter({
      data,
      getDataCallback: moviesData.get.bind(moviesData)
    });

    filter.addEventListener(`click`, (evt) => {
      filmsList.setFilterFunction(evt.filterFunction);
    });

    return filter;
  });

  for (const filter of filters) {
    moviesData.addListener(filter.render.bind(filter));
  }

  return filters;
}
