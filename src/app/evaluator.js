import $ from 'jquery';
import { createLogger } from './utils/logger';

/**
 * To identify the best outcome of an area we need to calculate multiple measure values.
 * These measure values show us a grade of the outcome and we can take the best result
 * for printing a PDF. To get the best result we sum up all the measure values with a weighting.
 * As lower as the value is as higher is the grade. For measure values with an answer of
 * yes or no, a value can be defined in the configuration file.
 * Following measure values are defined:
 * •	Total number of pages
 * •	Total pixel height of all whitespaces
 * •	Total pixel height of whitespaces we could not fill with an image or advertisement
 * •	Number of advertisements fulfilled
 * •	A topo an it’s related routes are on the same page / page spread
 */
export class Evaluator {

  /**
   * @param {Area} tree
   * @param {Booklet} booklet
   */
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
    this.totalPages = this.booklet.countTotalPages();

    const allWhitespaces = this.booklet.advertisements.getWhitespaceContainers();
    this.totalPixelOfAllWhitespaces = this.booklet.advertisements.getHeightOfAllWhiteSpaces(allWhitespaces);
    this.totalPixelOfUnfilledWhitespaces = this.countUnFilledWhiteSpaces(allWhitespaces);
    this.totalPixelOfFilledWhitespaces = this.booklet.advertisements.getHeightOfFilledWhiteSpaces(allWhitespaces);
    this.totalPixelOfAdsFilledWhitespaces = this.booklet.advertisements.getHeightOfAdsFilledWhitespaces(allWhitespaces);
    this.totalPercentAdvertisementFulfillment = this.countTotalPercentAdvertisementFulfillment(allWhitespaces);

    this.totalRoutes = this.countAllRoutes();
    this.totalFarOutRoutes = this.countFarOutRoutes();
    this.totalPercentFarOutRoutes = (100 / this.totalRoutes * this.totalFarOutRoutes);

    this.totalWidowCount = this.countTotalWidows();
    this.totalPercentWidows = this.countTotalPercentWidows();

    const advertisements = this.booklet.advertisements.getAdvertisements(allWhitespaces);
    this.totalAdsCount = advertisements.length;
    this.averageAdsDistance = Math.round((this.totalPages - 1) / (this.totalAdsCount - 1));
    this.totalPercentAdsDistribution = this.countTotalPercentAdsDistribution(advertisements);
  }

  /**
   * Evaluates the score of the rendered document. A lower score means a better result.
   *
   * @return {number} Document score
   */
  getScore() {
    const evaluationAdFulfillment = process.env.EVALUATION_AD_FULFILLMENT ? parseInt(process.env.EVALUATION_AD_FULFILLMENT, 10) : 1;
    const evaluationAdDistribution = process.env.EVALUATION_AD_DISTRIBUTION ? parseInt(process.env.EVALUATION_AD_DISTRIBUTION, 10) : 1;
    const evaluationFarOutRoutes = process.env.EVALUATION_FAR_OUT_ROUTES ? parseInt(process.env.EVALUATION_FAR_OUT_ROUTES, 10) : 1;
    const evaluationWidows = process.env.EVALUATION_WIDOWS ? parseInt(process.env.EVALUATION_WIDOWS, 10) : 1;

    const divisor = evaluationAdFulfillment
      + evaluationAdDistribution
      + evaluationFarOutRoutes
      + evaluationWidows;
    return parseInt((this.totalPercentAdvertisementFulfillment * evaluationAdFulfillment
      + this.totalPercentAdsDistribution * evaluationAdDistribution
      + this.totalPercentFarOutRoutes * evaluationFarOutRoutes
      + this.totalPercentWidows * evaluationWidows)
      / divisor, 10);
  }

  /**
   * Prints the evaluation of the tree to the console.
   */
  printToConsole() {
    this.log.info('=========================================');
    this.log.info('Evaluation of the tree');
    this.log.info('=========================================');
    this.log.info('totalPages', this.totalPages + ' pages');
    this.log.info('totalAdsCount', this.totalAdsCount + ' advertisements');
    this.log.info('averageAdsDistance', this.averageAdsDistance + ' pages');
    this.log.info('totalPercentAdsDistribution', this.totalPercentAdsDistribution + ' %');
    this.log.info(' ');
    this.log.info('totalPixelOfAllWhitespaces', this.totalPixelOfAllWhitespaces + ' pixel');
    this.log.info('totalPixelOfUnfilledWhitespaces', this.totalPixelOfUnfilledWhitespaces + ' pixel');
    this.log.info('totalPixelOfFilledWhitespaces', this.totalPixelOfFilledWhitespaces + ' pixel');
    this.log.info('totalPixelOfAdsFilledWhitespaces', this.totalPixelOfAdsFilledWhitespaces + ' pixel');
    this.log.info('totalPercentAdvertisementFulfillment', this.totalPercentAdvertisementFulfillment + ' %');
    this.log.info(' ');
    this.log.info('totalRoutes', this.totalRoutes + ' routes');
    this.log.info('totalFarOutRoutes', this.totalFarOutRoutes + ' routes');
    this.log.info('totalPercentFarOutRoutes', this.totalPercentFarOutRoutes + ' %');
    this.log.info(' ');
    this.log.info('totalWidowCount', this.totalWidowCount + ' widows');
    this.log.info('totalPercentWidows', this.totalPercentWidows + ' %');
    this.log.info('=========================================');
    this.log.info('Document score = ', this.getScore());
    this.log.info('=========================================');
  }

  /**
   * Counts all the whitespace of the document, which could not be filled
   * with an advertisement or an image.
   *
   * @param {Array<Object>} allWhitespaces
   * @returns {number} Amount whitespace pixel.
   */
  countUnFilledWhiteSpaces(allWhitespaces) {
    return this.booklet.advertisements.getHeightOfAllWhiteSpaces(allWhitespaces.filter(a => !a.hasContent));
  }

  /**
   * Counts the fulfillment of advertisements over the document in percentage.
   *
   * @param {Array<Object>} allWhitespaces
   * @returns {number} Percentage of advertisement fulfillment.
   */
  countTotalPercentAdvertisementFulfillment(allWhitespaces) {
    const totalDocHeight = (process.env.APP_CONTENT_HEIGHT * (this.booklet.countTotalPages() - 1));
    const totalAdsHeight = this.booklet.advertisements.getHeightOfAdsFilledWhitespaces(allWhitespaces);
    const percentAdsFulfilled = 100 / totalDocHeight * totalAdsHeight;
    return Math.abs(100 - (100 / process.env.APP_AD_AD_LEVEL * percentAdsFulfilled));
  }

  /**
   * Returns percentage of distribution of all advertisements.
   *
   * @param {Array} advertisements
   * @returns {number} Percentage of advertisement distribution
   */
  countTotalPercentAdsDistribution(advertisements) {
    const distances = advertisements.filter(ad => ad.next !== null)
      .map(ad => parseInt(ad.next.page - ad.page));
    let totalDeviation = 0;
    for (let i = 0; i < distances.length; ++i) {
      totalDeviation += Math.abs((distances[i] - this.averageAdsDistance));
    }
    return (totalDeviation / distances.length) / this.averageAdsDistance * 100;
  }

  /**
   * Counts all the routes printed in the document.
   *
   * @returns {number} Amount of routes.
   */
  countAllRoutes() {
    return $('.route__description').length;
  }

  /**
   * Counts all the routes which are not in sight of his responsible topo image.
   *
   * @returns {number} Amount of routes.
   */
  countFarOutRoutes() {
    return this.countAllRoutes() - $('.route__description.in-sight').length;
  }

  /**
   * Counts all the widows in the document.
   *
   * @returns {number} Amount of widows.
   */
  countTotalWidows() {
    return $('.is-widow').length;
  }

  /**
   * Returns the percentage of how many pages have widows.
   *
   * @returns {number} Percentage of pages have widows
   */
  countTotalPercentWidows() {
    return 100 / this.booklet.countTotalPages() * this.countTotalWidows();
  }

}
