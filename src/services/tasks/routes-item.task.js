import $ from 'jquery';

import { Task } from './task';
import * as areaView from '../../views/area.view';

/**
 * Adds a route item, which could be a route or a topo image, to
 * routes container of the current page in the booklet.
 */
export class RoutesItemTask extends Task {

  constructor(booklet, area, index) {
    super(booklet, area, areaView.routeItem(area.routeItems[index], area.id, index));
  }

  /**
   * Simply adds the html template to the current page.
   *
   * @param {Function} done
   */
  run(done) {
    this.booklet.addRouteItem(this.area, this.html, (page, routesContainer) => this.validate(page, routesContainer, done));
  }

  /**
   * It validates if any route of the current routes container is
   * outside of the page. If this is the case, then it will remove
   * the last route element and add it to a new page with a new routes
   * container. However, if the second last element is a topo image it
   * will also be placed on the new page.
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

      const lastElement = routesContainer.find('.route').not('.route--blank').last();
      lastElement.remove();
      this.booklet.removePossibleRouteZombies();
      this.booklet.addPage();

      this.booklet.addRoutesContainer(this.area, () => {
        const secondLastElement = routesContainer.find('.route').not('.route--blank').last();
        const $secondLastElement = $(secondLastElement);

        // Check if the second last element is a topo image.
        if ($secondLastElement.hasClass('route--topo')) {
          $secondLastElement.remove();
          this.booklet.addRouteItem(this.area, $secondLastElement.html(), () => {
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
