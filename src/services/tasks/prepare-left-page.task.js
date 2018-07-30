import { Task } from './task';
import { createLogger } from '../../utils/logger';

/**
 * Force a left page.
 */
export class PrepareLeftPageTask extends Task {

  /**
   * @param {Booklet} booklet
   * @param {Area} area
   */
  constructor(booklet, area) {
    super(booklet, area);

    this.log = createLogger('PrepareLeftPageTask');
  }

  /**
   * This adds pages to the booklet until the current page
   * is a left page.
   * @param {Function} done
   */
  run(done) {
    this.log.info('create left page');
    this.booklet.addPage();
    if (this.booklet.isRightPage()) {
      this.booklet.addPage();
    }
    done();
  }

}
