import $ from 'jquery';

import { Task } from './task';
import * as areaView from '../../views/area.view';

export class RoutesItemTask extends Task {

  constructor(booklet, area, index) {
    super(booklet, area, areaView.routeItem(area.routeItems[index], area.id, index));
  }

  run(done) {
    this.booklet.addRouteItem(this.html, (page, routesContainer) => this.validate(page, routesContainer, done));
  }

  validate(page, routesContainer, done) {
    const areSomeRoutesOutsideTheSheet = routesContainer.find('.topo, .route')
      .children()
      .toArray()
      .some(c => !this.booklet.isElementInsideCurrentSheet(c));

    if (areSomeRoutesOutsideTheSheet) {

      const lastElement = routesContainer.find('.route').not('.route--blank').last();
      lastElement.remove();
      this.booklet.removePossibleRouteZombies();
      this.booklet.addPage();

      this.booklet.addRoutesContainer(this.area, () => {
        const secondLastElement = routesContainer.find('.route').not('.route--blank').last();
        const $secondLastElement = $(secondLastElement);

        if ($secondLastElement.hasClass('route--topo')) {
          $secondLastElement.remove();
          this.booklet.addRouteItem($secondLastElement.html(), () => {
            this.run(done);
          });

        } else {
          this.run(done);
        }

      });

    } else {
      done();

    }
  }

}
