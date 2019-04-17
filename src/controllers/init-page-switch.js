

export default function initPageSwitch({statisticsButton, filters, films, statistics}) {
  statisticsButton.addEventListener(`click`, () => {
    statistics.unhide();
    statistics.render();
    films.hide();
    filters.forEach((item) => item.setActiveLink(`#stat`));
    statisticsButton.setActive(true);
  });

  for (const filter of filters) {
    filter.addEventListener(`click`, (evt) => {
      statisticsButton.setActive(false);
      statistics.hide();
      films.unhide();
      filters.forEach((item) => item.setActiveLink(evt.link));
    });
  }
}
