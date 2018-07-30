import { last } from 'lodash';

import * as areaView from '../views/area.view';
import { Task } from './task';

/**
 * Adds an area topo image of an area to the DOM.
 * This image shows the subareas of an area.
 */
export class AreaTopoTask extends Task {

  /**
   * @param {Booklet} booklet
   * @param {Area} area
   * @param {number} index
   */
  constructor(booklet, area, index) {
    super(booklet, area, areaView.topo(area.topos[index], area.id));

    this.index = index;
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
   * Validates if the image has enough space on the current page.
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
