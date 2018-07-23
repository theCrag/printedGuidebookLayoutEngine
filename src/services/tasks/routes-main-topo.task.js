import { Task } from './task';
import * as areaView from '../../views/area.view';

/**
 * A main topo image is full page with image, but not a
 * full-page image. In the most cases it is the first topo
 * image of the routes section or at the start of a page. It
 * also depends on the amount of routes in a image.
 */
export class RoutesMainTopoTask extends Task {

  constructor(booklet, area, index) {
    super(booklet, area, areaView.topo(area.routeItems[index], area.id));
  }

  /**
   * Simply adds the html template to the current page.
   *
   * @param {Function} done
   */
  run(done) {
    this.booklet.routes.addRouteMainTopo(this.html, (page, routesContainer) => this.validate(page, routesContainer, done));
  }

  /**
   * Validates if any route item is outside of the page. If the topo
   * image has no space in the current page it will be added ot the
   * next page.
   *
   * @param {HTMLElement} page
   * @param {HTMLElement} routesContainer
   * @param {Function} done
   */
  validate(page, routesContainer, done) {
    const areSomeRoutesOutsideTheSheet = routesContainer.find('.topo, .route')
      .children()
      .toArray()
      .some(c => !this.booklet.isElementInsideCurrentSheet(c));

    if (areSomeRoutesOutsideTheSheet) {
      routesContainer.remove();
      this.booklet.routes.removePossibleRouteZombies();
      this.booklet.addPage();

      this.booklet.routes.addRoutesContainer(this.area, () => {
        this.run(done);
      });

    } else {
      done();

    }
  }

}
