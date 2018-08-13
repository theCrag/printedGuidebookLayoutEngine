import $ from 'jquery';
import { last, cloneDeep } from 'lodash';

import * as areaView from '../views/area.view';
import { Task } from './task';

/**
 * Adds the map of the area to the DOM.
 */
export class AreaGeometryTask extends Task {

  /**
   * @param {Booklet} booklet
   * @param {Area} area
   */
  constructor(booklet, area) {
    super(booklet, area, areaView.geometry(cloneDeep(area)));
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
   * Validates if the map matches to the same page as his area
   * title and description.
   *
   * @param {HTMLElement} page
   * @param {Function} done
   */
  validate(page, done) {
    const lastElement = last(page.children());
    const img = lastElement.children[0];
    if (!this.booklet.isElementInsideCurrentSheet(img)) {

      let secondLastIsTitle = false;
      let secondLastElement = null;
      secondLastElement = page.children()[page.children().length - 2];
      if ($(secondLastElement).attr('id')) {
        if ($(secondLastElement).attr('id') === 'title-' + this.area.id) {
          secondLastIsTitle = true;
        }
      }

      // Move last element to new page
      lastElement.remove();
      this.booklet.addPage();

      // Move title or last element to new page
      if (secondLastIsTitle) {
        secondLastElement.remove();
        this.booklet.addContent(secondLastElement, () => this.booklet.addContent(this.html, done));
      } else {
        this.booklet.addContent(this.html, done);
      }

    } else {
      done();
    }
  }

}
