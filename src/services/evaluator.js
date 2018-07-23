import $ from 'jquery';
import { createLogger } from '../utils/logger';

/**
 * To identify the best outcome of an area we need to calculate multiple measure values. These measure values show us a grade of the outcome and we can take the best result for printing a PDF. To get the best result we sum up all the measure values with a weighting. As lower as the value is as higher is the grade. For measure values with an answer of yes or no, a value can be defined in the configuration file.
 * Following measure values are defined:
 * •	Total number of pages
 * •	Total pixel height of all whitespaces
 * •	Total pixel height of whitespaces we could not fill with an image or advertisement
 * •	Number of advertisements fulfilled
 * •	A topo an it’s related routes are on the same page / page spread
 */
export class Evaluator {

  constructor(tree, booklet) {
    this.tree = tree;
    this.booklet = booklet;

    this.totalPages = 0;
    this.totalPixelOfAllWhitespaces = 0;
    this.totalPixelOfUnfilledWhitespaces = 0;
    this.totalPixelOfFilledWhitespaces = 0;

    this.totalRoutes = 0;
    this.totalFarOutRoutes = 0;

    this.totalWidowCount = 0;
    this.totalWidowChars = 0;

    this.log = createLogger('Evaluator');
  }

  /**
   * Evaluates the targeted tree.
   */
  evaluate() {
    this.totalPages = this.countTotalPages();

    const allWhitespaces = this.booklet.advertisements.getWhitespaceContainers();
    this.totalPixelOfAllWhitespaces = this.countAllWhiteSpaces(allWhitespaces);
    this.totalPixelOfUnfilledWhitespaces = this.countUnFilledWhiteSpaces(allWhitespaces);
    this.totalPixelOfFilledWhitespaces = this.countFilledWhiteSpaces(allWhitespaces);
    this.totalPercentAdvertisementFulfillment = this.countAdvertisementFulfillment(allWhitespaces);

    this.totalRoutes = this.countAllRoutes();
    this.totalFarOutRoutes = this.countFarOutRoutes();

    this.totalWidowCount = this.countTotalWidows();
    this.totalWidowChars = this.countTotalWidowChars();
  }

  /**
   * Prints the evaluation of the tree to the console.
   */
  printToConsole() {
    this.log.info('=========================================');
    this.log.info('Evaluation of the tree');
    this.log.info('=========================================');
    this.log.info('totalPages', this.totalPages + ' pages');
    this.log.info('totalPixelOfAllWhitespaces', this.totalPixelOfAllWhitespaces + ' pixel');
    this.log.info('totalPixelOfUnfilledWhitespaces', this.totalPixelOfUnfilledWhitespaces + ' pixel');
    this.log.info('totalPixelOfFilledWhitespaces', this.totalPixelOfFilledWhitespaces + ' pixel');
    this.log.info('totalPercentAdvertisementFulfillment', this.totalPercentAdvertisementFulfillment + ' %');
    this.log.info(' ');
    this.log.info('totalRoutes', this.totalRoutes + ' routes');
    this.log.info('totalFarOutRoutes', this.totalFarOutRoutes + ' routes');
    this.log.info('totalFarOutRoutes', (100 / this.totalRoutes * this.totalFarOutRoutes) + ' %');
    this.log.info(' ');
    this.log.info('totalWidowCount', this.totalWidowCount + ' widows');
    this.log.info('totalWidowChars', this.totalWidowChars + ' characters in widows');
    this.log.info('=========================================');
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
   * Counts all the whitespace of the document.
   *
   * @param {Array<Object>} allWhitespaces
   * @returns {Number} Amount whitespace pixel.
   */
  countAllWhiteSpaces(allWhitespaces) {
    return allWhitespaces.length > 0
      ? allWhitespaces.map(a => a.maxHeight).reduce((a, v) => a + v)
      : 0;
  }

  /**
   * Counts all the whitespace of the document, which could not be filled
   * with advertisement or a image.
   *
   * @param {Array<Object>} allWhitespaces
   * @returns {Number} Amount whitespace pixel.
   */
  countUnFilledWhiteSpaces(allWhitespaces) {
    return this.countAllWhiteSpaces(allWhitespaces.filter(a => !a.filled));
  }

  /**
   * Counts all the whitespace of the document, which are filled
   * with advertisement or a image.
   *
   * @param {Array<Object>} allWhitespaces
   * @returns {Number} Amount whitespace pixel.
   */
  countFilledWhiteSpaces(allWhitespaces) {
    return this.countAllWhiteSpaces(allWhitespaces.filter(a => a.filled));
  }

  /**
   * Counts the fulfillment of the advertisement over the document in percentage.
   *
   * @param {Array<Object>} allWhitespaces
   * @returns {Number} Percentage of advertisement fulfillment.
   */
  countAdvertisementFulfillment(allWhitespaces) {
    return 100 / (929 * (this.countTotalPages() - 1)) * this.countFilledWhiteSpaces(allWhitespaces);
  }

  /**
   * Counts all the routes printed in the document.
   *
   * @returns {Number} Amount of routes.
   */
  countAllRoutes() {
    return $('.route__description').length;
  }

  /**
   * Counts all the routes which are not in sight of his responsible topo image.
   *
   * @returns {Number} Amount of routes.
   */
  countFarOutRoutes() {
    return this.countAllRoutes() - $('.route__description.in-sight').length;
  }

  /**
   * Counts all the widows in the document.
   *
   * @returns {Number} Amount of widows.
   */
  countTotalWidows() {
    return $('.is-widow').length;
  }

  /**
   * Counts all characters of any widows in the document.
   *
   * @returns {Number} Amount of characters in widows.
   */
  countTotalWidowChars() {
    let totalChars = 0;
    $('.is-widow').toArray().forEach((w) => {
      totalChars += w.innerText.length;
    });
    return totalChars;
  }

}
