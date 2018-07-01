import { last, cloneDeep } from 'lodash';

import * as areaView from '../../views/area.view';
import { Task } from './task';

export class AreaTitleTask extends Task {

  constructor(booklet, area) {
    super(booklet, area, areaView.title(cloneDeep(area)));
  }

  run(done) {
    this.booklet.addContent(this.html, (page) => this.validate(page, done));
  }

  validate(page, done) {
    const lastElement = last(page.children());

    if (!this.booklet.isElementInsideCurrentSheet(lastElement)) {

      // move last element to new page
      lastElement.remove();
      this.booklet.addPage();
      this.run(done);

    } else {
      done();
    }
  }

}
