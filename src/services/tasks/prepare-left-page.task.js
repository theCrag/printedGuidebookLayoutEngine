import { Task } from './task';
import { createLogger } from '../../utils/logger';

/**
 * Here a left page will be forced.
 */
export class PrepareLeftPageTask extends Task {

  constructor(booklet, area) {
    super(booklet, area);

    this.log = createLogger('PrepareLeftPageTask');
  }

  /**
   * This adds pages to the booklet until it the current page
   * is on the left site.
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
