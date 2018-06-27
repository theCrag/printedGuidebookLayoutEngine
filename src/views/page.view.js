export const page = (id, isLeftPage) => `
  <section
    id="page-${id}"
    class="sheet padding-10mm sheet--${isLeftPage ? 'left' : 'right'}"></section>`;
