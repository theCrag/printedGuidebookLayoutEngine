import { cloneDeep } from 'lodash';

import { Task } from './task';
import { createLogger } from '../../utils/logger';
import * as areaView from '../../views/area.view';
import { getPhotos } from '../api.service';


/**
 * TODO:
 */
export class CoverPageTask extends Task {

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
      this.html = areaView.cover(cloneDeep(this.area), photos[1]);
      this.booklet.addContent(this.html, () => {
        const page = this.booklet.getCurrentPage();
        const images = page.find('img');
        if (images.length > 1) {
          images.on('load', () => {
            this.booklet.addPage();
            done();
          });
        } else {
          this.booklet.addPage();
          done();
        }
      });
    });
  }

}
