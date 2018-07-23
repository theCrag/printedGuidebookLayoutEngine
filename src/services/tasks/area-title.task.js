import { last, cloneDeep } from 'lodash';

import * as areaView from '../../views/area.view';
import { Task } from './task';

/**
 * Adds a description of an area to the DOM.
 */
export class AreaTitleTask extends Task {

  constructor(booklet, area) {
    super(booklet, area, areaView.title(cloneDeep(area)));
  }

  /**
   * Simply adds the html template to the current page.
   *
   * @param {Function} done
   */
  run(done) {
    this.booklet.addContent(this.html, (page) => this.validate(page, done));
  }

  /**
   * Validates if the title has enough space in the current page
   *
   * @param {HTMLElement} page
   * @param {Function} done
   */
  validate(page, done) {
    const lastElement = last(page.children());

    if (!this.booklet.isElementInsideCurrentSheet(lastElement)) {

      // Move last element to new page
      lastElement.remove();
      this.booklet.addPage();
      this.run(done);

    } else {
      done();
    }
  }

}
