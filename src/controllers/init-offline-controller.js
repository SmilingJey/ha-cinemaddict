const OFFLINE_TEXT = `[OFFLINE]`;

/**
 * Переключение между online и offline режимами работы
 * @param {Object} param0
 */
export default function initOfflineController({moviesData}) {
  window.addEventListener(`offline`, () => {
    document.title = `${document.title} ${OFFLINE_TEXT}`;
  });

  window.addEventListener(`online`, () => {
    document.title = document.title.split(` ${OFFLINE_TEXT}`)[0];
    moviesData.sync();
  });
}
