import $ from 'jquery';
import { last } from 'lodash';

import { Task } from './task';
import { createLogger } from '../../utils/logger';

/**
 * Ensures that description block are at least as height as
 * the geometry component is.
 */
export class AreaDescriptionHeightTask extends Task {

  /**
   * @param {Booklet} booklet
   * @param {Area} area
   */
  constructor(booklet, area) {
    super(booklet, area);

    this.log = createLogger('AreaDescriptionHeightTask');
  }

  /**
   * Validates if height of description is at least like the height of geometry.
   *
   * @param {Function} done
   */
  run(done) {
    const page = this.booklet.getCurrentPage();
    const children = page.children();
    const lastElement = last(children);
    let geometryOnCurrentPage = false;
    let $geometry;
    children.toArray().forEach(element => {
      if ($(element).hasClass('geometry')){
        geometryOnCurrentPage = true;
        $geometry = $($(element).children()[0]);
      }
    });
    if (geometryOnCurrentPage){
      const $lastElement = $(lastElement);

      const geometryOffset = $geometry.offset();
      const totalGeometryHeight = geometryOffset.top + $geometry.height() + parseFloat($geometry.css('margin-bottom').slice(0, -2));
      const elementOffset = $lastElement.offset();
      const elementBottom = elementOffset.top + $lastElement.height();

      if (totalGeometryHeight > elementBottom){
        const diff = totalGeometryHeight - elementBottom;
        $lastElement.height($lastElement.height() + diff);
      }
    }
    done();
  }
}
