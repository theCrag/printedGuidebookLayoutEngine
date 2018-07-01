import { last } from 'lodash';

import * as areaView from '../../views/area.view';
import { Task } from './task';

export class AreaTopoTask extends Task {

  constructor(booklet, area, index) {
    super(booklet, area, areaView.topo(area.topos[index], area.id));

    this.index = index;
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
