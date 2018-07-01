import { Task } from './task';
import * as areaView from '../../views/area.view';

export class RoutesMainTopoTask extends Task {

  constructor(booklet, area, index) {
    super(booklet, area, areaView.topo(area.routeItems[index], area.id));
  }

  run(done) {
    this.booklet.addRouteMainTopo(this.html, (page, routesContainer) => this.validate(page, routesContainer, done));
  }

  validate(page, routesContainer, done) {
    const areSomeRoutesOutsideTheSheet = routesContainer.find('.topo, .route')
      .children()
      .toArray()
      .some(c => !this.booklet.isElementInsideCurrentSheet(c));

    if (areSomeRoutesOutsideTheSheet) {
      routesContainer.remove();
      this.booklet.removePossibleRouteZombies();
      this.booklet.addPage();

      this.booklet.addRoutesContainer(this.area, () => {
        this.run(done);
      });

    } else {
      done();

    }
  }

}
