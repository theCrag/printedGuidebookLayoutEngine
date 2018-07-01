/**
 * @name page
 * @description
 * Creates the html for a page.
 *
 * @param {number} id
 * @param {boolean} isLeftPage
 * @returns {string} html
 */
export const page = (id, isLeftPage) => `
  <section
    id="page-${id}"
    class="sheet padding-10mm sheet--${isLeftPage ? 'left' : 'right'}"></section>`;
