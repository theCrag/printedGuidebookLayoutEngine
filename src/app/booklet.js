import $ from 'jquery';
import { page } from './views/page.view';
import { createLogger } from './utils/logger';
import { Advertisements } from './advertisements';
import { Routes } from './routes';

/**
 * The booklet class keeps track of the rendered pages.
 */
export class Booklet {

  constructor() {
    this.advertisements = new Advertisements(this);
    this.routes = new Routes(this);
    this.pageCounter = 0;

    this.log = createLogger('Booklet');
  }

  /**
   * Sets the current page to zero. To restart
   * the booklet creation. The page counter is used
   * to mark the pages with their number.
   */
  init() {
    this.pageCounter = 0;
    this.advertisements.init();
  }

  /**
   * Resets the routes container counter. This counter is used
   * for the routes container to mark them with an index to be
   * identical.
   */
  initArea() {
    this.routes.routeContainerCounter = 0;
  }

  /**
   * Returns if it is a left page or not.
   *
   * @returns {boolean} isLeftPage
   */
  isLeftPage() {
    return this.pageCounter % 2 === 0;
  }

  /**
   * Returns if it is a right page or not.
   *
   * @returns {boolean} isRightPage
   */
  isRightPage() {
    return !this.isLeftPage();
  }

  /**
   * Returns the last page.
   *
   * @returns {Object} currentPage
   */
  getCurrentPage() {
    return $(`#page-${this.pageCounter}`);
  }

  /**
   * Sets the root title in header on each page
   *
   * @param {string} title
   */
  setRootTitle(title) {
    $('.root-title').html(title);
  }

  /**
   * Counts the total pages of the document.
   *
   * @returns {Number} Amount of pages.
   */
  countTotalPages() {
    return $('.sheet').length;
  }

  /**
   * Adds a new empty page.
   */
  addPage() {
    this.pageCounter = this.pageCounter + 1;
    $('main').append(page(this.pageCounter, this.isLeftPage()));
    $('.total-pages').html(this.pageCounter);
    this.log.info('addPage', this.pageCounter);
  }

  /**
   * Adds content to the current page.
   *
   * @param {string} html
   * @param {Function} done
   */
  addContent(html, done) {
    const page = this.getCurrentPage();
    page.append(html);

    const images = page.children().last().find('img').not('.logo');
    if (images.length > 0) {
      images.on('load', () => done(page));
    } else {
      done(page);
    }
  }

  /**
   * Removes the last page.
   */
  removeLastPage() {
    if (this.pageCounter === 1) {
      return;
    }
    this.getCurrentPage().remove();
    this.pageCounter = this.pageCounter - 1;
  }

  /**
   * Removes the whole content of an area and as well empty pages at the end.
   *
   * @param {Area} area
   */
  removeAllAreaRelatedElements(area) {
    $(`.area-${area.id}`).remove();
    $('.sheet').toArray().reverse().some((sheet) => {
      const $sheet = $(sheet);
      if ($sheet.children().length === 2) {
        this.removeLastPage();
      } else {
        return true;
      }
    });
  }

  /**
   * Takes a jQuery element and checks if the element fits in the current page.
   *
   * @param {HTMLElement} element
   * @returns {boolean} fits
   */
  isElementInsideCurrentSheet(element) {
    if (element) {
      const parentSheet = $(element.closest('.sheet'));
      element = $(element);

      const sheetOffset = parentSheet.offset() || { top: 0 };
      const paddingTop = parseFloat(parentSheet.css('padding-top').slice(0, -2));
      const totalPageHeight = sheetOffset.top + paddingTop + (parentSheet.height() || 0);
      const elementOffset = element.offset() || { top: 0 };
      const elementBottom = elementOffset.top + (element.height() || 0);

      return elementBottom < totalPageHeight;
    }
    return true;
  }

  /**
   * Takes a jQuery element and returns the max available height for this element,
   * until it reaches the end of the page content.
   *
   * @param {HTMLElement} element
   * @returns {number} maxHeight
   */
  getMaxHeight(element) {
    if (element) {
      const parentSheet = $(element.closest('.sheet'));
      element = $(element);

      const sheetOffset = parentSheet.offset();
      const paddingTop = parseFloat(parentSheet.css('padding-top').slice(0, -2));
      const totalPageHeight = sheetOffset.top + paddingTop + parentSheet.height();
      const elementOffset = element.offset();
      const elementTop = elementOffset.top;

      return parseInt(totalPageHeight - elementTop);
    }
    return 0;
  }

  /**
   * Takes a jQuery element and returns the max available height for this element in a column.
   * If there is no content after the columns, the height is calculated till the end of the page,
   * otherwise the height is calculated till the end of the column-container.
   *
   * @param {HTMLElement} element
   * @returns {number} maxHeight
   */
  getMaxColumnHeight(element) {
    if (element) {
      const parentColumnContainer = $(element.closest('.routes'));
      element = $(element);
      if (parentColumnContainer.next().length === 0 || (parentColumnContainer.next().children().length === 0 && parentColumnContainer.next().html().trim() === '')) {
        return this.getMaxHeight(element);
      } else {
        const containerOffset = parentColumnContainer.offset();
        const paddingTop = parseFloat(parentColumnContainer.css('padding-top').slice(0, -2));
        const totalContainerHeight = containerOffset.top + paddingTop + parentColumnContainer.height();
        const elementOffset = element.offset();
        const elementTop = elementOffset.top;

        return parseInt(totalContainerHeight - elementTop);
      }

    }
    return 0;
  }

  /**
   * Adds a rear page and optionally a fill page to ensure rear page is
   * a left page.
   */
  addRearPage() {
    if (this.isLeftPage()) {
      this.addPage();
      this.addPage();
    } else {
      this.addPage();
    }
  }
}

