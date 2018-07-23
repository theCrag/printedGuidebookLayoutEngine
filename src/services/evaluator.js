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

    this.log = createLogger('Evaluator');
  }

  evaluate() {
    this.totalPages = this.countTotalPages();

    const allWhitespaces = this.booklet.advertisements.getWhitespaceContainers();
    this.totalPixelOfAllWhitespaces = this.countAllWhiteSpaces(allWhitespaces);
    this.totalPixelOfUnfilledWhitespaces = this.countUnFilledWhiteSpaces(allWhitespaces);
    this.totalPixelOfFilledWhitespaces = this.countFilledWhiteSpaces(allWhitespaces);
  }

  printToConsole() {
    this.log.info('=========================================');
    this.log.info('Evaluation of the tree');
    this.log.info('=========================================');
    this.log.info('totalPages', this.totalPages);
    this.log.info('totalPixelOfAllWhitespaces', this.totalPixelOfAllWhitespaces);
    this.log.info('totalPixelOfUnfilledWhitespaces', this.totalPixelOfUnfilledWhitespaces);
    this.log.info('totalPixelOfFilledWhitespaces', this.totalPixelOfFilledWhitespaces);
    this.log.info('=========================================');
  }

  countAllWhiteSpaces(allWhitespaces) {
    return allWhitespaces.length > 0
      ? allWhitespaces.map(a => a.maxHeight).reduce((a, v) => a + v)
      : 0;
  }

  countUnFilledWhiteSpaces(allWhitespaces) {
    return this.countAllWhiteSpaces(allWhitespaces.filter(a => !a.filled));
  }

  countFilledWhiteSpaces(allWhitespaces) {
    return this.countAllWhiteSpaces(allWhitespaces.filter(a => a.filled));
  }

  countTotalPages() {
    return $('.sheet').length;
  }

}
