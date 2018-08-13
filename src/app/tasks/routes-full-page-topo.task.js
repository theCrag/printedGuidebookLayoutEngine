import { Task } from './task';

/**
 * TODO: Gery
 */
export class RoutesFullPageTopoTask extends Task {

  /**
   * @param {Booklet} booklet
   * @param {Area} area
   * @param {number} index
   */
  constructor(booklet, area, index) {
    super(booklet, area);

    this.index = index;
  }

  /**
   * Simply adds the html template to the current page.
   *
   * @param {Function} done
   */
  run(done) {
    // TODO: Gery
    done();
  }

}
