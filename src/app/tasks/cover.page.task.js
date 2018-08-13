import { cloneDeep } from 'lodash';

import { Task } from './task';
import { createLogger } from '../utils/logger';
import * as areaView from '../views/area.view';
import { getPhotos } from '../services/api.service';


/**
 * Creates a cover page at the top of the document.
 */
export class CoverPageTask extends Task {

  /**
   * @param {Booklet} booklet
   * @param {Area} area
   */
  constructor(booklet, area) {
    super(booklet, area, '');

    this.log = createLogger('CoverPageTask');
  }

  /**
   * Simply adds the html template to the current page.
   *
   * @param {Function} done
   */
  run(done) {
    this.log.info('set cover page');

    getPhotos(this.area.id, (photos) => {
      let photo = undefined;
      if (photos.length > 0) {
        photo = photos[0];
      }
      this.html = areaView.cover(cloneDeep(this.area), photo);
      this.booklet.addContent(this.html, () => {
        this.booklet.addPage();
        done();
      });
    });
  }

}
