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
        this.booklet.addPage();
        done();
      });
    });
  }

}
