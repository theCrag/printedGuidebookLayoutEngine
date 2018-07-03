import $ from 'jquery';
import { last, cloneDeep } from 'lodash';

import * as areaView from '../../views/area.view';
import { Task } from './task';

export class AreaGeometryTask extends Task {

  constructor(booklet, area) {
    super(booklet, area, areaView.geometry(cloneDeep(area)));
  }

  run(done) {
    this.booklet.addContent(this.html, (page) => this.validate(page, done));
  }

  validate(page, done) {
    const lastElement = last(page.children());
    const img = lastElement.children[0];
    // debugger;
    if (!this.booklet.isElementInsideCurrentSheet(img)) {

      let secondLastIsTitle = false;
      let secondLastElement = null;
      secondLastElement = page.children()[page.children().length - 2];
      if ($(secondLastElement).attr('id')) {
        if ($(secondLastElement).attr('id') === 'title-' + this.area.id) {
          secondLastIsTitle = true;
        }
      }

      // move last element to new page
      lastElement.remove();
      this.booklet.addPage();

      // move title or last element to new page
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
