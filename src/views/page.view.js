import logo from '../assets/logo-light.svg';

/**
 * Creates the html for a page.
 *
 * @param {number} id
 * @param {boolean} isLeftPage
 * @returns {string} html
 */
export const page = (id, isLeftPage) => `
  <section
    id="page-${id}"
    class="sheet padding-10mm sheet--${isLeftPage ? 'left' : 'right'}">
    <header>
      <div>
        <img class="logo" src="${logo}"/>
      </div>
      <div>
        <span>Root Title</span>
      </div>
    </header>
    <footer>
      <div>
        <span>${id}</span>
        <span>/</span>
        <span class="total-pages">${id}</span>
      </div>
    </footer>
  </section>`;
