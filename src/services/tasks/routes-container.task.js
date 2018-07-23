import { Task } from './task';

/**
 * Just adds a simple routes container to the current
 * page in the booklet.
 */
export class RoutesContainerTask extends Task {

  constructor(booklet, area) {
    super(booklet, area);
  }

  /**
   * Simply adds the html template to the current page.
   *
   * @param {Function} done
   */
  run(done) {
    this.booklet.addRoutesContainer(this.area, done);
  }

}
